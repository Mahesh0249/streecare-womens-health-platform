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
        <div className="min-h-screen flex items-center justify-center bg-rose-50 py-8">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden m-4">
                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-rose-600">{t('signup.title')}</h1>
                        <p className="text-gray-500 mt-2">{t('signup.subtitle')}</p>
                    </div>
                     {isOffline && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded" role="alert">
                            <p className="font-bold">Offline Demo Mode</p>
                            <p className="text-sm">You can sign up with any details to explore the app. Your data will not be saved.</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                {t('signup.name')}
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500' : 'focus:ring-rose-500'}`}
                                required
                                disabled={isSigningUp}
                                placeholder={t('signup.name.placeholder')}
                            />
                            {errors.name && <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                {t('login.email')}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'focus:ring-rose-500'}`}
                                required
                                disabled={isSigningUp}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                {t('login.password')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500' : 'focus:ring-rose-500'}`}
                                required
                                disabled={isSigningUp}
                                placeholder="••••••••"
                            />
                             {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
                        </div>
                         <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                               {t('signup.password.confirm')}
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500' : 'focus:ring-rose-500'}`}
                                required
                                disabled={isSigningUp}
                                placeholder="••••••••"
                            />
                             {errors.confirmPassword && <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">{t('signup.role')}</label>
                            <div className="flex items-center justify-around">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={UserRole.PATIENT}
                                        checked={role === UserRole.PATIENT}
                                        onChange={() => setRole(UserRole.PATIENT)}
                                        className="form-radio text-rose-500 focus:ring-rose-500"
                                        disabled={isSigningUp}
                                    />
                                    <span>{t('signup.role.patient')}</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="role"
                                        value={UserRole.DOCTOR}
                                        checked={role === UserRole.DOCTOR}
                                        onChange={() => setRole(UserRole.DOCTOR)}
                                        className="form-radio text-rose-500 focus:ring-rose-500"
                                        disabled={isSigningUp}
                                    />
                                    <span>{t('signup.role.doctor')}</span>
                                </label>
                            </div>
                        </div>
                        {apiError && <p className="text-red-500 text-xs italic mb-4 text-center">{apiError}</p>}
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-rose-300"
                                disabled={isSigningUp}
                            >
                                {isSigningUp ? t('signup.button.loading') : t('signup.button')}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>
                            {t('signup.haveAccount')}{' '}
                            <Link to="/login" className="font-semibold text-rose-500 hover:text-rose-600">
                                {t('signup.logIn')}
                            </Link>
                        </p>
                    </div>
                </div>
                 {/* Image Section */}
                 <div className="hidden md:block md:w-1/2">
                    <img 
                        src="https://images.unsplash.com/photo-1622253692010-33352f4568d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                        alt="Female doctor smiling" 
                        className="w-full h-full object-cover" 
                    />
                </div>
            </div>
        </div>
    );
};

export default SignupPage;