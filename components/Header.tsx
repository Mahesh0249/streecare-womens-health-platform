
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import type { Language } from '../types';
import { MenuIcon, XIcon, UserCircleIcon } from './icons'; // Assuming you'll add these icons
import { UserRole } from '../types';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { t, language, setLanguage } = useTranslation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsUserDropdownOpen(false);
    };

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setIsUserDropdownOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsUserDropdownOpen(false); // Close user dropdown when opening mobile menu
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
        setIsMobileMenuOpen(false); // Close mobile menu when opening user dropdown
    };

    const closeMenus = () => {
      setIsMobileMenuOpen(false);
      setIsUserDropdownOpen(false);
    };

    // Navigation links array
    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', roles: [UserRole.PATIENT, UserRole.DOCTOR] },
        { path: '/appointments', label: 'Appointments', roles: [UserRole.PATIENT, UserRole.DOCTOR] },
        { path: '/tracker', label: 'Menstrual Tracker', roles: [UserRole.PATIENT] },
        { path: '/forum', label: 'Community Forum', roles: [UserRole.PATIENT, UserRole.DOCTOR] },
        { path: '/emotrack', label: 'Emo Track', roles: [UserRole.PATIENT] },
        { path: '/saathi', label: 'Saathi AI', roles: [UserRole.PATIENT, UserRole.DOCTOR] },
        { path: '/community-outreach', label: 'Community Outreach', roles: [UserRole.PATIENT, UserRole.DOCTOR] },
        // Doctor-specific navigation
        { path: '/live-meeting', label: 'Live Meetings', roles: [UserRole.DOCTOR] },
        // Patient-specific navigation  
        { path: '/patient-meetings', label: 'Awareness Sessions', roles: [UserRole.PATIENT] },
    ];

    return (
        <header className="bg-white shadow-md dark:bg-gray-800 transition-colors duration-200 sticky top-0 z-50">
            <div className="w-full max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link to="/dashboard" className="text-2xl font-bold text-[var(--color-primary-500)] dark:text-[var(--color-primary-400)] mr-6" onClick={closeMenus}>
                    StreeCare
                </Link>

                {/* Desktop Navigation */}
                <nav className="flex items-center space-x-6">
                    {user && navLinks.map((link) => {
                      const shouldShow = link.roles.includes(user.role);
                      return shouldShow && (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors duration-200 px-3 py-2 border border-transparent hover:border-gray-300 rounded"
                          onClick={closeMenus}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                </nav>

                {/* User & Language Controls (Desktop) */}
                <div className="flex items-center space-x-4">
                    {/* Removed Language Selection Buttons from Header */}
                    {user && (
                        <div className="relative">
                            <button onClick={toggleUserDropdown} className="focus:outline-none flex items-center space-x-2">
                                <img src={`https://picsum.photos/seed/${user.id}/40/40`} alt="User avatar" className="w-10 h-10 rounded-full border-2 border-rose-500" />
                                <span className="text-gray-700 dark:text-gray-200 font-medium">{user.name}</span>
                                <UserCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                            </button>
                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-2 z-20 animate-fade-in border border-gray-200 dark:border-gray-600">
                                    {/* User Info Section */}
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">Role: {user.role}</p>
                                    </div>
                                    
                                    {/* Profile Options */}
                                    <Link to="/profile" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" onClick={closeMenus}>
                                        <div className="flex items-center space-x-3">
                                            <UserCircleIcon className="w-5 h-5 text-gray-500" />
                                            <span>Profile Details</span>
                                        </div>
                                    </Link>
                                    
                                    <Link to="/settings" className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200" onClick={closeMenus}>
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>Settings</span>
                                        </div>
                                    </Link>
                                    
                                    <button onClick={() => { navigate('/role-selection'); closeMenus(); }} className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Change Account</span>
                                        </div>
                                    </button>
                                    
                                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                    
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                                        <div className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    {!user && <span className="text-red-500 text-sm">No user</span>}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-2">
                    {/* Removed Language Selection Buttons from Mobile Menu */}
                    <button onClick={toggleMobileMenu} className="text-gray-600 dark:text-gray-300 focus:outline-none">
                        {isMobileMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg py-4 px-4 animate-fade-in">
                    <nav className="flex flex-col space-y-3">
                      {user && navLinks.map((link) => {
                        const shouldShow = link.roles.includes(user.role);
                        return shouldShow && (
                          <Link
                            key={link.path}
                            to={link.path}
                            className="block text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors duration-200"
                            onClick={closeMenus}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                      {user && (
                        <Link to="/settings" className="block text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors duration-200" onClick={closeMenus}>
                          {t('header.settings')}
                        </Link>
                      )}
                      <button onClick={handleLogout} className="block w-full text-left text-gray-700 dark:text-gray-200 hover:text-rose-600 dark:hover:text-rose-400 font-medium transition-colors duration-200">
                          {t('header.logout')}
                      </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
