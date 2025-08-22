
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { DashboardIcon, AppointmentsIcon, TrackerIcon, ForumIcon, MusicIcon, BotIcon } from './icons';

const commonLinks = [
  { to: '/dashboard', icon: DashboardIcon, labelKey: 'nav.dashboard' },
  { to: '/appointments', icon: AppointmentsIcon, labelKey: 'nav.appointments' },
  { to: '/forum', icon: ForumIcon, labelKey: 'nav.forum' },
  { to: '/saathi', icon: BotIcon, labelKey: 'nav.saathi' },
];

const patientLinks = [
  { to: '/tracker', icon: TrackerIcon, labelKey: 'nav.tracker' },
  { to: '/emotrack', icon: MusicIcon, labelKey: 'nav.emotrack' },
];

const Sidebar: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    
    const navLinks = user?.role === UserRole.PATIENT ? [...commonLinks, ...patientLinks] : commonLinks;

    const linkClasses = "flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-rose-100 hover:text-rose-600 transition-colors duration-200";
    const activeLinkClasses = "bg-rose-500 text-white hover:bg-rose-600 hover:text-white";

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="h-16 flex items-center justify-center border-b border-gray-200">
                <h1 className="text-2xl font-bold text-rose-600">StreeCare</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navLinks.map(({ to, icon: Icon, labelKey }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
                        }
                    >
                        <Icon className="w-6 h-6 mr-3" />
                        <span>{t(labelKey)}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
