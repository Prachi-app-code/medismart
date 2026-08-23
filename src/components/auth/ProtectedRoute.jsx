import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-500">Checking credentials...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && profile && !allowedRoles.includes(profile.role)) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200 shadow-card text-center space-y-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
          🚫
        </div>
        <h2 className="text-2xl font-bold text-text">Access Restricted</h2>
        <p className="text-sm text-slate-600">
          This portal requires a <strong>{allowedRoles.join(' or ')}</strong> account. You are currently signed in as <strong>{profile.role}</strong>.
        </p>
        <button
          onClick={() => window.history.back()}
          className="btn-secondary text-sm px-6 py-2.5"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
}
