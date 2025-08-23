import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

const SettingsPage: React.FC = () => {
  const { user, updateUserProfile, changeUserPassword } = useAuth();
  const { t, setLanguage, language } = useTranslation();
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  // Profile Management State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Notification Preferences State
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  
  // Theme Selection State
  // const [theme, setTheme] = useState('light'); // 'light' or 'dark' - REMOVED: now from useTheme hook

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    if (user) {
      try {
        await updateUserProfile(user.id, { name, email });
        setProfileMessage(t('settings.profileUpdateSuccess'));
      } catch (error: any) {
        setProfileMessage(`${t('settings.profileUpdateError')}: ${error.message}`);
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    if (newPassword !== confirmNewPassword) {
      setPasswordMessage(t('settings.passwordMismatch'));
      return;
    }
    if (user) {
      try {
        await changeUserPassword(user.id, currentPassword, newPassword);
        setPasswordMessage(t('settings.passwordChangeSuccess'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } catch (error: any) {
        setPasswordMessage(`${t('settings.passwordChangeError')}: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-6 sm:p-8 animate-fade-in transition-colors duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 sm:p-10">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 text-center">{t('settings.title')}</h1>
        
        {/* Profile Management */}
        <section className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('settings.profileManagement')}</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.name')}</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.email')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="btn-primary py-3 px-6"
            >
              {t('settings.updateProfile')}
            </button>
            {profileMessage && <p className="mt-3 text-sm text-green-600 dark:text-green-400">{profileMessage}</p>}
          </form>
        </section>

        {/* Change Password */}
        <section className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('settings.changePassword')}</h2>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.currentPassword')}</label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.newPassword')}</label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.confirmNewPassword')}</label>
              <input
                type="password"
                id="confirm-new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm py-3 px-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="btn-primary py-3 px-6"
            >
              {t('settings.changePasswordButton')}
            </button>
            {passwordMessage && <p className="mt-3 text-sm text-green-600 dark:text-green-400">{passwordMessage}</p>}
          </form>
        </section>

        {/* Notification Preferences */}
        <section className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('settings.notificationPreferences')}</h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.emailNotifications')}</label>
              <input
                type="checkbox"
                id="email-notifications"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-6 w-6 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="in-app-notifications" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.inAppNotifications')}</label>
              <input
                type="checkbox"
                id="in-app-notifications"
                checked={inAppNotifications}
                onChange={(e) => setInAppNotifications(e.target.checked)}
                className="h-6 w-6 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <button
              type="button"
              onClick={() => console.log('Saving notification preferences:', { emailNotifications, inAppNotifications })}
              className="btn-primary py-3 px-6"
            >
              {t('settings.savePreferences')}
            </button>
          </div>
        </section>

        {/* Theme Selection */}
        <section className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('settings.themeSelection')}</h2>
          <div className="flex items-center space-x-6">
            <label htmlFor="theme-light" className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                id="theme-light"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={toggleTheme}
                className="h-5 w-5 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] border-gray-300 dark:border-gray-600"
              />
              <span className="text-base font-medium text-gray-700 dark:text-gray-300">{t('settings.themeLight')}</span>
            </label>
            <label htmlFor="theme-dark" className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                id="theme-dark"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                className="h-5 w-5 text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] border-gray-300 dark:border-gray-600"
              />
              <span className="text-base font-medium text-gray-700 dark:text-gray-300">{t('settings.themeDark')}</span>
            </label>
          </div>
        </section>

        {/* Language Selection */}
        <section className="card">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('settings.languageSelection')}</h2>
          <div className="flex items-center space-x-4">
            <button aria-label="Switch to English" onClick={() => setLanguage('en')} className={`px-4 py-2 text-base rounded-lg font-medium transition-colors duration-200 ${language === 'en' ? 'bg-[var(--color-primary-500)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>English</button>
            <button aria-label="Switch to Telugu" onClick={() => setLanguage('te')} className={`px-4 py-2 text-base rounded-lg font-medium transition-colors duration-200 ${language === 'te' ? 'bg-[var(--color-primary-500)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>తెలుగు</button>
            <button aria-label="Switch to Hindi" onClick={() => setLanguage('hi')} className={`px-4 py-2 text-base rounded-lg font-medium transition-colors duration-200 ${language === 'hi' ? 'bg-[var(--color-primary-500)] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>हिन्दी</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
