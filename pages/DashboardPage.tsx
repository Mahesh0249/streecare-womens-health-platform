
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { AppointmentsIcon, TrackerIcon, ForumIcon } from '../components/icons';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { mockPatientDashboard, mockDoctorDashboard } from '../services/mockData';

const PatientDashboard = () => {
    const { isOffline } = useAuth();
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            if (isOffline) {
                setSummary(mockPatientDashboard);
                setLoading(false);
                return;
            }
            const token = localStorage.getItem('streecare_token');
            try {
                const res = await fetch(`${API_BASE_URL}/api/dashboard/summary`, {
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

    if (loading) return <div>Loading dashboard...</div>;

    const nextAppointmentDate = summary?.nextAppointment ? new Date(summary.nextAppointment.appointment_date) : null;
    const nextPeriodInDays = summary?.lastPeriodStart ? 28 - ((new Date().getTime() - new Date(summary.lastPeriodStart).getTime()) / (1000 * 3600 * 24)) : null;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <AppointmentsIcon className="w-8 h-8 text-rose-500 mr-4" />
                        <h2 className="text-xl font-semibold">Upcoming Appointment</h2>
                    </div>
                    {summary?.nextAppointment ? (
                        <>
                            <p className="mt-4 text-gray-600">Dr. {summary.nextAppointment.doctor_name}</p>
                            <p className="text-gray-500">{nextAppointmentDate?.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {nextAppointmentDate?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <Link to="/appointments" className="mt-4 text-rose-500 font-semibold inline-block">View Details</Link>
                        </>
                    ) : (
                        <p className="mt-4 text-gray-500">No upcoming appointments.</p>
                    )}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <TrackerIcon className="w-8 h-8 text-teal-500 mr-4" />
                        <h2 className="text-xl font-semibold">Menstrual Cycle</h2>
                    </div>
                     {nextPeriodInDays !== null ? (
                        <>
                            <p className="mt-4 text-gray-600">Next period expected in <span className="font-bold">{Math.round(nextPeriodInDays)} days</span>.</p>
                            <p className="text-gray-500">Based on a 28-day cycle.</p>
                        </>
                    ) : (
                         <p className="mt-4 text-gray-500">Log your first period to see predictions.</p>
                    )}
                    <Link to="/tracker" className="mt-4 text-teal-500 font-semibold inline-block">Go to Tracker</Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <ForumIcon className="w-8 h-8 text-indigo-500 mr-4" />
                        <h2 className="text-xl font-semibold">Community Forum</h2>
                    </div>
                    <p className="mt-4 text-gray-600">Connect with others and share your experiences anonymously.</p>
                    <Link to="/forum" className="mt-4 text-indigo-500 font-semibold inline-block">Join Discussion</Link>
                </div>
            </div>
        </div>
    );
};

const DoctorDashboard = () => {
    const { isOffline } = useAuth();
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            if (isOffline) {
                setSummary(mockDoctorDashboard);
                setLoading(false);
                return;
            }
            const token = localStorage.getItem('streecare_token');
            try {
                const res = await fetch(`${API_BASE_URL}/api/dashboard/summary`, {
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

    if (loading) return <div>Loading dashboard...</div>;
    
    const appointments = summary?.todaysAppointments || [];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
                    {appointments.length > 0 ? (
                        <ul className="space-y-4">
                            {appointments.map((appt: any) => (
                                <li key={appt.id} className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{appt.patient_name}</p>
                                        <p className="text-sm text-gray-500">{new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appt.reason || 'Checkup'}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${appt.status === 'confirmed' ? 'text-green-800 bg-green-200' : 'text-yellow-800 bg-yellow-200'}`}>{appt.status}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No appointments scheduled for today.</p>
                    )}
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-col space-y-3">
                         <Link to="/appointments" className="w-full text-center bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600">View Full Schedule</Link>
                         <Link to="/forum" className="w-full text-center bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">Visit Community Forum</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    return user?.role === UserRole.PATIENT ? <PatientDashboard /> : <DoctorDashboard />;
};

export default DashboardPage;