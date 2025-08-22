import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const { login, isOffline } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    
    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'email':
                if (!value.trim()) error = t('validation.email.required');
                else if (!/\S+@\S+\.\S+/.test(value)) error = t('validation.email.invalid');
                break;
            case 'password':
                if (!value) error = t('validation.password.required');
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
        
        setIsLoggingIn(true);
        try {
            await login(formData.email, formData.password); 
            navigate('/dashboard');
        } catch (err: any) {
            setApiError(err.message || t('login.error'));
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden m-4">
                {/* Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-rose-600">StreeCare</h1>
                        <p className="text-gray-500 mt-2">{t('login.subtitle')}</p>
                    </div>
                    {isOffline && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded" role="alert">
                            <p className="font-bold">Offline Demo Mode</p>
                            <p className="text-sm">You can log in with any email (e.g., <code className="bg-yellow-200 px-1 rounded">patient@example.com</code> or <code className="bg-yellow-200 px-1 rounded">doctor@example.com</code>) to explore the app.</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
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
                                disabled={isLoggingIn}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-6">
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
                                disabled={isLoggingIn}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>}
                        </div>
                        {apiError && <p className="text-red-500 text-xs italic mb-4 text-center">{apiError}</p>}
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-rose-300"
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? 'Logging in...' : t('login.button')}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>
                            {t('login.noAccount')}{' '}
                            <Link to="/signup" className="font-semibold text-rose-500 hover:text-rose-600">
                                {t('login.signUp')}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Image Section */}
                <div className="hidden md:block md:w-1/2">
                    <img 
                        src="https://images.unsplash.com/photo-1576091160550-2173dba9996a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                        alt="Doctor with tablet" 
                        className="w-full h-full object-cover" 
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;