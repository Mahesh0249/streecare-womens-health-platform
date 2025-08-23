
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { I18nProvider } from './contexts/I18nContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import AppointmentsPage from './pages/AppointmentsPage';
import TrackerPage from './pages/TrackerPage';
import ForumPage from './pages/ForumPage';
import EmoTrackPage from './pages/EmoTrackPage';
import SaathiChatPage from './pages/SaathiChatPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ServerStatusBanner from './components/ServerStatusBanner';
import ErrorBoundary from './components/ErrorBoundary'; // Import the ErrorBoundary component
import CommunityOutreachPage from './pages/CommunityOutreachPage';
import SettingsPage from './pages/SettingsPage'; // Import SettingsPage
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import LiveMeetingPage from './pages/LiveMeetingPage';
import PatientMeetingsPage from './pages/PatientMeetingsPage';

const ServerStatusWrapper: React.FC = () => {
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
      <AppContent />
    </>
  );
};

const AppContent: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="tracker" element={<TrackerPage />} />
            <Route path="forum" element={<ForumPage />} />
            <Route path="emotrack" element={<EmoTrackPage />} />
            <Route path="saathi" element={<SaathiChatPage />} />
            <Route path="community-outreach" element={<CommunityOutreachPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="live-meeting" element={<LiveMeetingPage />} />
            <Route path="patient-meetings" element={<PatientMeetingsPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};


function App(): React.ReactNode {
  return (
    <I18nProvider>
      <AuthProvider>
        <ThemeProvider> {/* Wrap with ThemeProvider */}
          <ErrorBoundary>
            <ServerStatusWrapper />
          </ErrorBoundary>
        </ThemeProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
