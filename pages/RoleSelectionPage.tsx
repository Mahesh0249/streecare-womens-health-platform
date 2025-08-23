import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const RoleSelectionPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleRoleSelection = (role: 'patient' | 'doctor') => {
        navigate(`/login?role=${role}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-primary-500)] text-white p-4 sm:p-8 transition-colors duration-200">
            <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 sm:p-10 text-center animate-fade-in">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] mb-4">
                    {t('login.title')}
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8">
                    {t('roleSelection.subtitle')}
                </p>
                <div className="space-y-6 w-full max-w-sm mx-auto">
                    <button
                        onClick={() => handleRoleSelection('patient')}
                        className="btn-primary w-full py-3 px-4"
                    >
                        {t('roleSelection.patientButton')}
                    </button>
                    <button
                        onClick={() => handleRoleSelection('doctor')}
                        className="btn-secondary w-full py-3 px-4"
                    >
                        {t('roleSelection.doctorButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;
