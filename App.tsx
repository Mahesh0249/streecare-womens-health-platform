
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { I18nProvider } from './contexts/I18nContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import TrackerPage from './pages/TrackerPage';
import ForumPage from './pages/ForumPage';
import EmoTrackPage from './pages/EmoTrackPage';
import SaathiChatPage from './pages/SaathiChatPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ServerStatusBanner from './components/ServerStatusBanner';

const AppContent: React.FC = () => {
  const { isOffline, isCheckingStatus } = useAuth();

  if (isCheckingStatus) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-rose-500 border-dashed rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold">Connecting to StreeCare server...</p>
      </div>
    );
  }

  return (
    <>
      {isOffline && <ServerStatusBanner />}
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><DashboardPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Layout><AppointmentsPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/tracker" element={
            <ProtectedRoute>
              <Layout><TrackerPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/forum" element={
            <ProtectedRoute>
              <Layout><ForumPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/emotrack" element={
            <ProtectedRoute>
              <Layout><EmoTrackPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/saathi" element={
            <ProtectedRoute>
              <Layout><SaathiChatPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </>
  );
};


function App(): React.ReactNode {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
