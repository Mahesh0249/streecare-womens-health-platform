
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import type { Language } from '../types';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { t, language, setLanguage } = useTranslation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">{t('header.welcome')}, {user?.name}</h2>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <button aria-label="Switch to English" onClick={() => handleLanguageChange('en')} className={`px-2 py-1 text-sm rounded ${language === 'en' ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>EN</button>
                    <button aria-label="Switch to Telugu" onClick={() => handleLanguageChange('te')} className={`px-2 py-1 text-sm rounded ${language === 'te' ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>TE</button>
                    <button aria-label="Switch to Hindi" onClick={() => handleLanguageChange('hi')} className={`px-2 py-1 text-sm rounded ${language === 'hi' ? 'bg-rose-500 text-white' : 'bg-gray-200'}`}>HI</button>
                </div>
                <div className="relative">
                    <button
                        id="user-menu-button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                        aria-controls="user-menu"
                        aria-label="User menu"
                    >
                         <img src={`https://picsum.photos/seed/${user?.id}/40/40`} alt="User avatar" className="w-10 h-10 rounded-full" />
                    </button>
                    {dropdownOpen && (
                        <div
                            id="user-menu"
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="user-menu-button"
                        >
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-100"
                                role="menuitem"
                            >
                                {t('header.logout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
