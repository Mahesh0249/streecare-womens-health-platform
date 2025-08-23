import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { useTranslation } from '../hooks/useTranslation';

const SignupPage: React.FC = () => {
    const { t } = useTranslation();
    const { signup, isOffline } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!value.trim()) error = t('validation.name.required');
                break;
            case 'email':
                if (!value.trim()) error = t('validation.email.required');
                else if (!/\S+@\S+\.\S+/.test(value)) error = t('validation.email.invalid');
                break;
            case 'password':
                if (!value) error = t('validation.password.required');
                else if (value.length < 8) error = t('validation.password.minLength');
                else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value)) error = t('validation.password.complexity');
                break;
            case 'confirmPassword':
                if (!value) error = t('validation.confirmPassword.required');
                else if (value !== formData.password) error = t('validation.confirmPassword.match');
                break;
            default:
                break;
        }
        return error;
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));

        if (name === 'password') {
            const confirmError = validateField('confirmPassword', formData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
        Object.keys(formData).forEach(key => {
            const fieldError = validateField(key, formData[key as keyof typeof formData]);
            if (fieldError) {
                newErrors[key] = fieldError;
                isValid = false;
            }
        });
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        if (!validateForm()) return;
        
        setIsSigningUp(true);
        try {
            await signup(formData.name, formData.email, formData.password, role);
            navigate('/dashboard');
        } catch (err: any) {
            setApiError(err.message || t('signup.error'));
        } finally {
            setIsSigningUp(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primary-500)] text-white p-4 sm:p-8 transition-colors duration-200">
            <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 sm:p-10 text-center animate-fade-in">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] mb-4">
                    {t('signup.title')}
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8">
                    {t('signup.subtitle')}
                </p>

                {isOffline && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded" role="alert">
                        <p className="font-bold">Offline Demo Mode</p>
                        <p className="text-sm">You can sign up with any details to explore the app. Your data will not be saved.</p>
                    </div>
                )}
                {apiError && <p className="text-red-500 mb-4 text-sm">{apiError}</p>}

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 text-left" htmlFor="name">
                            {t('signup.name')}
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-5 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            required
                            disabled={isSigningUp}
                            placeholder={t('signup.name.placeholder')}
                        />
                        {errors.name && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 text-left" htmlFor="email">
                            {t('login.email')}
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-5 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            required
                            disabled={isSigningUp}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 text-left" htmlFor="password">
                            {t('login.password')}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-5 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            required
                            disabled={isSigningUp}
                            placeholder="••••••••"
                        />
                         {errors.password && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.password}</p>}
                    </div>
                     <div>
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 text-left" htmlFor="confirmPassword">
                           {t('signup.password.confirm')}
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-5 py-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            required
                            disabled={isSigningUp}
                            placeholder="••••••••"
                        />
                         {errors.confirmPassword && <p className="text-red-500 text-xs italic mt-1 text-left">{errors.confirmPassword}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2 text-left">{t('signup.role')}</label>
                        <div className="flex items-center justify-around space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value={UserRole.PATIENT}
                                    checked={role === UserRole.PATIENT}
                                    onChange={() => setRole(UserRole.PATIENT)}
                                    className="form-radio text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                                    disabled={isSigningUp}
                                />
                                <span className="text-gray-700 dark:text-gray-200">{t('signup.role.patient')}</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value={UserRole.DOCTOR}
                                    checked={role === UserRole.DOCTOR}
                                    onChange={() => setRole(UserRole.DOCTOR)}
                                    className="form-radio text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]"
                                    disabled={isSigningUp}
                                />
                                <span className="text-gray-700 dark:text-gray-200">{t('signup.role.doctor')}</span>
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        disabled={isSigningUp}
                    >
                        {isSigningUp ? t('signup.button.loading') : t('signup.button')}
                    </button>
                </form>
                
                <p className="mt-6 text-gray-700 dark:text-gray-300">
                    {t('signup.haveAccount')}{' '}
                    <Link to="/login" className="text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] hover:underline font-medium">
                        {t('signup.logIn')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;