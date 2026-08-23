import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const AuthContext = createContext();

// Preset Demo Profiles for instant testing
const DEMO_PROFILES = {
  patient: {
    id: 'demo_patient_001',
    email: 'margaret.vance@medismart.io',
    full_name: 'Margaret Vance',
    role: 'patient',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    phone: '+1 (555) 234-8901',
    emergency_contact: 'Sarah Vance (Daughter) - +1 (555) 987-6543',
    doctor_name: 'Dr. Robert Chen (Cardiology)',
    organizer_id: 'BOX-MED-8492'
  },
  caregiver: {
    id: 'demo_caregiver_001',
    email: 'sarah.vance@medismart.io',
    full_name: 'Dr. Sarah Vance, RN',
    role: 'caregiver',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    phone: '+1 (555) 987-6543',
    emergency_contact: '+1 (555) 123-4567',
    doctor_name: 'Licensed Registered Nurse',
    organizer_id: 'CAREGIVER-HUB-01'
  },
  doctor: {
    id: 'demo_doctor_001',
    email: 'dr.chen@medismart.io',
    full_name: 'Dr. Robert Chen, MD',
    role: 'doctor',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    phone: '+1 (555) 888-9999',
    emergency_contact: 'St. Jude General Hospital',
    doctor_name: 'Chief of Cardiology',
    organizer_id: 'CLINIC-DESK-4'
  }
};

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
        // Construct temporary profile from metadata if DB trigger hasn't fired yet
        return {
          id: userId,
          email: userMetadata.email || '',
          full_name: userMetadata.full_name || 'User',
          role: userMetadata.role || 'patient',
          avatar_url: userMetadata.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
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
    if (isSupabaseConfigured && supabase) {
      // Check active Supabase session
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const userProf = await fetchProfile(session.user.id, session.user.user_metadata);
          setProfile(userProf);
        } else {
          // Check if user had a saved mock session
          const savedMock = localStorage.getItem('medi_mock_user');
          if (savedMock) {
            const parsed = JSON.parse(savedMock);
            setUser({ id: parsed.id, email: parsed.email });
            setProfile(parsed);
          }
        }
        setLoading(false);
      });

      // Listen for auth changes
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
      // Local Demo Mode (defaulting to saved mock or Margaret Vance)
      try {
        const savedMock = localStorage.getItem('medi_mock_user');
        if (savedMock) {
          const parsed = JSON.parse(savedMock);
          setUser({ id: parsed.id, email: parsed.email });
          setProfile(parsed);
        } else {
          // Default initial demo state
          const defaultDemo = DEMO_PROFILES.patient;
          setUser({ id: defaultDemo.id, email: defaultDemo.email });
          setProfile(defaultDemo);
          localStorage.setItem('medi_mock_user', JSON.stringify(defaultDemo));
        }
      } catch (e) {
        setUser({ id: DEMO_PROFILES.patient.id, email: DEMO_PROFILES.patient.email });
        setProfile(DEMO_PROFILES.patient);
      }
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
      setProfile(userProf);
      return data;
    } else {
      // Demo / Mock Sign In logic
      let matchedProfile = DEMO_PROFILES.patient;
      if (email.toLowerCase().includes('caregiver') || email.toLowerCase().includes('sarah')) {
        matchedProfile = DEMO_PROFILES.caregiver;
      } else if (email.toLowerCase().includes('doctor') || email.toLowerCase().includes('chen')) {
        matchedProfile = DEMO_PROFILES.doctor;
      } else {
        matchedProfile = {
          ...DEMO_PROFILES.patient,
          email: email,
          full_name: email.split('@')[0].replace('.', ' ').toUpperCase()
        };
      }
      setUser({ id: matchedProfile.id, email: matchedProfile.email });
      setProfile(matchedProfile);
      localStorage.setItem('medi_mock_user', JSON.stringify(matchedProfile));
      return { user: { id: matchedProfile.id, email: matchedProfile.email } };
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
            doctor_name: doctorName,
            avatar_url: role === 'caregiver'
              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
              : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
          }
        }
      });
      if (error) throw error;
      return data;
    } else {
      // Demo Sign Up
      const newMock = {
        id: `user_${Date.now()}`,
        email: email,
        full_name: fullName,
        role: role,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        phone: phone,
        emergency_contact: emergencyContact,
        doctor_name: doctorName,
        organizer_id: `BOX-MED-${Math.floor(1000 + Math.random() * 9000)}`
      };
      setUser({ id: newMock.id, email: newMock.email });
      setProfile(newMock);
      localStorage.setItem('medi_mock_user', JSON.stringify(newMock));
      return { user: newMock };
    }
  };

  // 3. Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('medi_mock_user');
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  // 4. Reset Password (Forgot Password email)
  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return data;
    } else {
      // Mock reset response
      return { message: 'Password reset link sent (demo simulation)' };
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
      return { message: 'Password updated successfully (demo simulation)' };
    }
  };

  // 6. Demo Quick-Login Helper
  const loginWithDemoRole = (roleKey = 'patient') => {
    const target = DEMO_PROFILES[roleKey] || DEMO_PROFILES.patient;
    setUser({ id: target.id, email: target.email });
    setProfile(target);
    localStorage.setItem('medi_mock_user', JSON.stringify(target));
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
        updatePassword,
        loginWithDemoRole
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
