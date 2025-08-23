
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { UserRole } from '../types';
import { AppointmentsIcon, TrackerIcon, ForumIcon } from '../components/icons';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { mockPatientDashboard, mockDoctorDashboard } from '../services/mockData';
import DoctorDashboardPage from './DoctorDashboardPage';

const PatientDashboard = () => {
    const { isOffline } = useAuth();
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { t, language } = useTranslation(); // Initialize useTranslation

    useEffect(() => {
        const fetchSummary = async () => {
            if (isOffline) {
                setSummary(mockPatientDashboard);
                setLoading(false);
                return;
            }
            const token = localStorage.getItem('streecare_token');
            try {
                const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard summary", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [isOffline]);

    if (loading) return <p className="text-center text-gray-600 dark:text-gray-300">{t('dashboard.loading')}</p>;

    const nextAppointmentDate = summary?.nextAppointment ? new Date(summary.nextAppointment.appointment_date) : null;
    const nextPeriodInDays = summary?.lastPeriodStart ? 28 - ((new Date().getTime() - new Date(summary.lastPeriodStart).getTime()) / (1000 * 3600 * 24)) : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 animate-fade-in transition-colors duration-200">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 tracking-tight">{t('dashboard.patientTitle')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="card p-6">
                    <div className="flex items-center mb-4">
                        <AppointmentsIcon className="w-10 h-10 text-[var(--color-primary-500)] mr-4" />
                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200">{t('dashboard.upcomingAppointment')}</h2>
                    </div>
                    {summary?.nextAppointment ? (
                        <>
                            <p className="mt-4 text-base text-gray-700 dark:text-gray-300">{t('dashboard.doctorPrefix')} {summary.nextAppointment.doctor_name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{nextAppointmentDate?.toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {nextAppointmentDate?.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })}</p>
                            <Link to="/appointments" className="mt-4 btn-primary inline-block text-sm py-2 px-4">{t('dashboard.viewDetails')}</Link>
                        </>
                    ) : (
                        <p className="mt-4 text-base text-gray-600 dark:text-gray-400 italic">{t('dashboard.noUpcomingAppointments')}</p>
                    )}
                    <Link to="/appointments" className="mt-6 w-full btn-primary py-3 px-6 text-center text-base block">{t('appointments.bookNew')}</Link>
                </div>
                <div className="card p-6">
                    <div className="flex items-center mb-4">
                        <TrackerIcon className="w-10 h-10 text-[var(--color-secondary-500)] mr-4" />
                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200">{t('dashboard.menstrualCycle')}</h2>
                    </div>
                     {nextPeriodInDays !== null ? (
                        <>
                            <p className="mt-4 text-base text-gray-700 dark:text-gray-300">{t('dashboard.nextPeriod', { days: Math.round(nextPeriodInDays) })}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{t('dashboard.basedOnCycle')}</p>
                        </>
                    ) : (
                         <p className="mt-4 text-base text-gray-600 dark:text-gray-400 italic">{t('dashboard.logFirstPeriod')}</p>
                    )}
                    <Link to="/tracker" className="mt-4 btn-secondary inline-block text-sm py-2 px-4 block">{t('dashboard.goToTracker')}</Link>
                </div>
                <div className="card p-6">
                    <div className="flex items-center mb-4">
                        <ForumIcon className="w-10 h-10 text-[var(--color-accent-500)] mr-4" />
                        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-gray-200">{t('dashboard.communityForum')}</h2>
                    </div>
                    <p className="mt-4 text-base text-gray-700 dark:text-gray-300">{t('dashboard.forumDescription')}</p>
                    <Link to="/forum" className="mt-4 bg-[var(--color-accent-500)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-accent-600)] transition-colors duration-200 inline-block text-sm">{t('dashboard.joinDiscussion')}</Link>
                </div>
            </div>
        </div>
    );
};

const DoctorDashboard = () => {
    const { isOffline } = useAuth();
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { t, language } = useTranslation(); // Initialize useTranslation

    useEffect(() => {
        const fetchSummary = async () => {
            if (isOffline) {
                setSummary(mockDoctorDashboard);
                setLoading(false);
                return;
            }
            const token = localStorage.getItem('streecare_token');
            try {
                const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setSummary(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard summary", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, [isOffline]);

    if (loading) return <p className="text-center text-gray-600 dark:text-gray-300">{t('dashboard.loading')}</p>;
    
    const appointments = summary?.todaysAppointments || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 animate-fade-in transition-colors duration-200">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mb-8 tracking-tight">{t('dashboard.doctorTitle')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('dashboard.todaysAppointments')}</h2>
                    {appointments.length > 0 ? (
                        <ul className="space-y-4">
                            {appointments.map((appt: any) => (
                                <li key={appt.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                                    <div>
                                        <p className="font-semibold text-base text-gray-800 dark:text-gray-200">{t('dashboard.patientPrefix')} {appt.patient_name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(appt.appointment_date).toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' })} - {appt.reason || t('dashboard.checkup')}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${appt.status === 'confirmed' ? 'text-green-800 bg-green-200 dark:bg-green-700 dark:text-green-100' : 'text-yellow-800 bg-yellow-200 dark:bg-yellow-700 dark:text-yellow-100'}`}>{appt.status}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-base text-gray-600 dark:text-gray-400 italic">{t('dashboard.noTodaysAppointments')}</p>
                    )}
                </div>
                 <div className="card p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('dashboard.quickActions')}</h2>
                    <div className="flex flex-col space-y-4">
                         <Link to="/appointments" className="btn-primary text-center w-full py-3 px-6">{t('dashboard.viewFullSchedule')}</Link>
                         <Link to="/forum" className="bg-[var(--color-accent-500)] text-white px-6 py-3 rounded-lg hover:bg-[var(--color-accent-600)] transition-colors duration-200 text-center w-full font-medium">{t('dashboard.visitCommunityForum')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    // If user is a doctor, show doctor dashboard
    if (user?.role === UserRole.DOCTOR) {
        return <DoctorDashboardPage />;
    }

    // Patient dashboard (existing code)
    return <PatientDashboard />;
};

export default DashboardPage;