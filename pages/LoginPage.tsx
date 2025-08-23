import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { useTranslation } from '../hooks/useTranslation';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') as 'patient' | 'doctor' | null;

  useEffect(() => {
    if (!role) {
      setApiError(t('login.roleNotSpecified'));
    }
  }, [role, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setIsLoading(true);

    if (!role) {
      setApiError(t('login.roleNotSpecified'));
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password, role as UserRole);
      navigate('/dashboard');
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDynamicTitle = () => {
    if (role === UserRole.PATIENT) return t('login.subtitle.patient');
    if (role === UserRole.DOCTOR) return t('login.subtitle.doctor');
    return t('login.subtitle');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primary-500)] text-white p-4 sm:p-8 transition-colors duration-200">
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 sm:p-10 text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] mb-4">
          {t('login.title')}
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8">
          {getDynamicTitle()}
        </p>

        {apiError && <p className="text-red-500 mb-4 text-sm">{apiError}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder={t('login.email')}
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder={t('login.password')}
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? t('login.loggingIn') : t('login.button')}
          </button>
        </form>

        <p className="mt-6 text-gray-700 dark:text-gray-300">
          {t('login.noAccount')} <Link to="/signup" className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] hover:underline font-medium">{t('login.signUp')}</Link>
        </p>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          {t('login.goBackToRoleSelection')} <Link to="/role-selection" className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] hover:underline font-medium">{t('login.clickHere')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;