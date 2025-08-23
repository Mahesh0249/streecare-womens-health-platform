import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { API_BASE_URL } from '../config';
import type { Appointment } from '../types';
import { useNavigate } from 'react-router-dom';

const DoctorDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        pendingAppointments: 0
    });

    useEffect(() => {
        fetchDoctorData();
    }, []);

    const fetchDoctorData = async () => {
        try {
            const token = localStorage.getItem('streecare_token');
            const response = await fetch(`${API_BASE_URL}/api/appointments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data: Appointment[] = await response.json();
                // Filter appointments
                const now = new Date();
                const upcoming = data.filter((apt: Appointment) => 
                    new Date(apt.appointment_date) > now
                ) || [];
                setUpcomingAppointments(upcoming);
                setStats({
                    totalPatients: 0, // Optionally fetch from another endpoint
                    todayAppointments: upcoming.filter((apt: Appointment) => {
                        const aptDate = new Date(apt.appointment_date);
                        return aptDate.toDateString() === now.toDateString();
                    }).length,
                    pendingAppointments: upcoming.length
                });
            }
        } catch (error) {
            console.error('Failed to fetch doctor data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Quick Actions Functions
    const handleScheduleMeeting = () => {
        navigate('/live-meeting');
    };

    const handleViewPatientRecords = () => {
        navigate('/appointments');
    };

    const handleSendHealthTips = async () => {
        try {
            const token = localStorage.getItem('streecare_token');
            const response = await fetch(`${API_BASE_URL}/api/doctors/health-tips`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    message: "Stay hydrated and maintain a balanced diet for better health!",
                    doctor_id: user?.id
                })
            });
            
            if (response.ok) {
                alert('Health tips sent successfully to your patients!');
            } else {
                alert('Failed to send health tips. Please try again.');
            }
        } catch (error) {
            console.error('Failed to send health tips:', error);
            alert('Failed to send health tips. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-rose-500 border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 animate-fade-in transition-colors duration-200">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                            Doctor Dashboard
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Welcome back, Dr. {user?.name}
                        </p>
                    </div>
                    <button 
                        onClick={fetchDoctorData}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium cursor-pointer"
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalPatients}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Appointments</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.todayAppointments}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Appointments</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pendingAppointments}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={handleScheduleMeeting}
                                className="w-full bg-rose-600 text-white py-3 px-4 rounded-lg hover:bg-rose-700 transition-colors duration-200 font-medium cursor-pointer"
                            >
                                Schedule Live Meeting
                            </button>
                            <button 
                                onClick={handleViewPatientRecords}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium cursor-pointer"
                            >
                                View Patient Records
                            </button>
                            <button 
                                onClick={handleSendHealthTips}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium cursor-pointer"
                            >
                                Send Health Tips
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <span>Appointment confirmed with Sarah Johnson</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <span>Live meeting scheduled for tomorrow</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                                <span>Health tips sent to 15 patients</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            Upcoming Appointments ({upcomingAppointments.length})
                        </h3>
                        <button 
                            onClick={() => navigate('/appointments')}
                            className="text-rose-600 hover:text-rose-700 text-sm font-medium cursor-pointer"
                        >
                            View All →
                        </button>
                    </div>
                    {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingAppointments.slice(0, 5).map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-200">
                                            {appointment.patient_name || 'Patient'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(appointment.appointment_date).toLocaleDateString()} - {appointment.reason}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {appointment.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 mb-2">No upcoming appointments</p>
                            <button 
                                onClick={() => navigate('/appointments')}
                                className="text-rose-600 hover:text-rose-700 text-sm font-medium cursor-pointer"
                            >
                                Check all appointments →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboardPage;
