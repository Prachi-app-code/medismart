import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create profile from Supabase
  const fetchProfile = async (userId, userMetadata = null) => {
    if (!supabase || !isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile from Supabase:', error);
      }

      if (data) {
        return data;
      } else if (userMetadata) {
        return {
          id: userId,
          email: userMetadata.email || '',
          full_name: userMetadata.full_name || 'User',
          role: userMetadata.role || 'patient',
          avatar_url: userMetadata.avatar_url || null,
          phone: userMetadata.phone || '',
          emergency_contact: userMetadata.emergency_contact || '',
          doctor_name: userMetadata.doctor_name || '',
          organizer_id: userMetadata.organizer_id || 'BOX-MED-8492'
        };
      }
      return null;
    } catch (err) {
      console.error('Exception fetching profile:', err);
      return null;
    }
  };

  useEffect(() => {
    // Clear any legacy demo mock session from storage
    try {
      localStorage.removeItem('medi_mock_user');
    } catch (e) {}

    if (isSupabaseConfigured && supabase) {
      // Check active Supabase session
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const userProf = await fetchProfile(session.user.id, session.user.user_metadata);
          setProfile(userProf);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const userProf = await fetchProfile(session.user.id, session.user.user_metadata);
          setProfile(userProf);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Offline / No active user
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  }, []);

  // 1. Sign In
  const signIn = async ({ email, password }) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (error) throw error;
      const userProf = await fetchProfile(data.user.id, data.user.user_metadata);
      setUser(data.user);
      setProfile(userProf);
      return data;
    } else {
      throw new Error('Supabase backend not configured. Please add your credentials to .env file.');
    }
  };

  // 2. Sign Up
  const signUp = async ({ email, password, fullName, role = 'patient', phone = '', emergencyContact = '', doctorName = '' }) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
            phone: phone,
            emergency_contact: emergencyContact,
            doctor_name: doctorName
          }
        }
      });

      if (error) throw error;

      if (data?.user) {
        const userProf = {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: role,
          avatar_url: null,
          phone: phone,
          emergency_contact: emergencyContact,
          doctor_name: doctorName,
          organizer_id: 'BOX-MED-8492'
        };
        setUser(data.user);
        setProfile(userProf);

        try {
          await supabase.from('profiles').upsert(userProf);
        } catch (upsertErr) {
          // Trigger handles this, non-critical
        }
      }

      return data;
    } else {
      throw new Error('Supabase backend not configured. Please add your credentials to .env file.');
    }
  };

  // 3. Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // 4. Reset Password
  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return data;
    } else {
      throw new Error('Supabase backend not configured.');
    }
  };

  // 5. Update Password
  const updatePassword = async (newPassword) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return data;
    } else {
      throw new Error('Supabase backend not configured.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
