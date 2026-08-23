import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MedicationProvider } from './context/MedicationContext';
import { CaregiverProvider } from './context/CaregiverContext';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import ToastContainer from './components/shared/Toast';
import HardwareSimulatorModal from './components/simulator/HardwareSimulatorModal';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load pages for performance optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Schedule = lazy(() => import('./pages/Schedule'));
const AddMedicine = lazy(() => import('./pages/AddMedicine'));
const History = lazy(() => import('./pages/History'));
const Caregiver = lazy(() => import('./pages/Caregiver'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <span className="text-sm font-bold text-slate-500">Loading MediSmart...</span>
      </div>
    </div>
  );
}

// App shell layout with Header, Sidebar, and Bottom Navigation
function MainLayout({ onOpenSimulator }) {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans antialiased">
      {/* Top Navigation Bar */}
      <Header onOpenSimulator={onOpenSimulator} />

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenSimulator={onOpenSimulator} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto mb-16 md:mb-0">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard onOpenSimulator={onOpenSimulator} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <Schedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <AddMedicine />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/caregiver"
                element={
                  <ProtectedRoute allowedRoles={['caregiver', 'doctor', 'patient']}>
                    <Caregiver />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  return (
    <AuthProvider>
      <MedicationProvider>
        <CaregiverProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Authenticated Dashboard Routes */}
                <Route path="/*" element={<MainLayout onOpenSimulator={() => setIsSimulatorOpen(true)} />} />
              </Routes>
            </Suspense>

            {/* Live Toast Notifications */}
            <ToastContainer />

            {/* Smart Pillbox Hardware Testing Lab Modal */}
            <HardwareSimulatorModal
              isOpen={isSimulatorOpen}
              onClose={() => setIsSimulatorOpen(false)}
            />
          </BrowserRouter>
        </CaregiverProvider>
      </MedicationProvider>
    </AuthProvider>
  );
}
