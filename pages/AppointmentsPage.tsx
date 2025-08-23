
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole, Appointment, User } from '../types';
import { API_BASE_URL } from '../config';
import { useTranslation } from '../hooks/useTranslation';
import { mockAppointments, mockDoctorAppointments, mockDoctors } from '../services/mockData';

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const BookAppointmentModal: React.FC<{
    doctors: User[];
    onClose: () => void;
    onBook: (details: { doctorId: string; date: string; reason: string }) => Promise<void>;
}> = ({ doctors, onClose, onBook }) => {
    const { t } = useTranslation();
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [reason, setReason] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsBooking(true);
        try {
            await onBook({ doctorId, date, reason });
            onClose();
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">{t('bookAppointment.title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('bookAppointment.doctor')}</label>
                        <select
                            id="doctor"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] p-3"
                        >
                            <option value="" disabled>{t('bookAppointment.selectDoctor')}</option>
                            {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('bookAppointment.date')}</label>
                        <input
                            type="datetime-local"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] p-3"
                        />
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('bookAppointment.reason')}</label>
                        <input
                            type="text"
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            placeholder={t('bookAppointment.reason.placeholder')}
                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] p-3"
                        />
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium">{t('form.cancel')}</button>
                        <button type="submit" disabled={isBooking} className="px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium">
                            {isBooking ? t('bookAppointment.button.booking') : t('bookAppointment.button.book')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PatientAppointmentsPage: React.FC = () => {
    const { t } = useTranslation();
    const { isOffline, user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchAppointments = async () => {
        console.log("Fetching appointments...");
        const token = localStorage.getItem('streecare_token');
        try {
            const res = await fetch(`${API_BASE_URL}/appointments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                console.log("Appointments fetched:", data);
                setAppointments(data);
            } else {
                console.error("Failed to fetch appointments, response not OK:", res.status);
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };
    
    const fetchDoctors = async () => {
         const token = localStorage.getItem('streecare_token');
        try {
            const res = await fetch(`${API_BASE_URL}/appointments/doctors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDoctors(data);
            } else {
                console.error("Failed to fetch doctors, response not OK:", res.status);
            }
        } catch (error) {
            console.error("Failed to fetch doctors", error);
        }
    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            if (isOffline) {
                setAppointments(mockAppointments);
                setDoctors(mockDoctors);
            } else {
                await Promise.all([fetchAppointments(), fetchDoctors()]);
            }
            setLoading(false);
        };
        loadData();
    }, [isOffline]);

    const handleBookAppointment = async (details: { doctorId: string; date: string; reason: string }) => {
        console.log("Attempting to book appointment with details:", details);
        setError('');
        setSuccess('');
        
        if (isOffline) {
            const doctor = doctors.find(d => d.id === details.doctorId);
            const newAppointment: Appointment = {
                id: `mock_${Date.now()}`,
                doctor_name: doctor?.name || 'Unknown Doctor',
                appointment_date: details.date,
                reason: details.reason,
                status: 'confirmed',
                doctor_id: details.doctorId,
                patient_id: user?.id,
            };
            setAppointments(prev => [newAppointment, ...prev].sort((a,b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()));
            setSuccess(t('bookAppointment.success'));
            return;
        }

        const token = localStorage.getItem('streecare_token');
        try {
            const res = await fetch(`${API_BASE_URL}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(details)
            });
            console.log("Response from booking appointment API:", res);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || t('bookAppointment.error'));
            }
            setSuccess(t('bookAppointment.success'));
            fetchAppointments(); // Refresh the list
        } catch (err: any) {
            console.error("Error booking appointment:", err);
            setError(err.message);
        }
    };

    const upcomingAppointments = appointments.filter(a => new Date(a.appointment_date) >= new Date());
    const pastAppointments = appointments.filter(a => new Date(a.appointment_date) < new Date());
    console.log("Upcoming appointments:", upcomingAppointments);
    console.log("Past appointments:", pastAppointments);

    if (loading) return <p className="text-center text-gray-600 dark:text-gray-300 py-10">{t('appointments.loading')}</p>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 sm:p-8 animate-fade-in transition-colors duration-200">
            {isModalOpen && <BookAppointmentModal doctors={doctors} onClose={() => setIsModalOpen(false)} onBook={handleBookAppointment} />}
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">{t('nav.appointments')}</h1>
            
            {success && <div className="bg-green-100 dark:bg-green-800 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-100 px-4 py-3 rounded-lg relative mb-6 animate-fade-in" role="alert">{success}</div>}
            {error && <div className="bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded-lg relative mb-6 animate-fade-in" role="alert">{error}</div>}

            <div className="space-y-8">
                <div className="card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{t('appointments.upcoming')}</h2>
                        <button onClick={() => setIsModalOpen(true)} className="btn-primary text-base px-5 py-2">{t('appointments.bookNew')}</button>
                    </div>
                    <ul className="space-y-4">
                        {upcomingAppointments.length > 0 ? upcomingAppointments.map(appt => (
                            <li key={appt.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition-shadow duration-200">
                                <div>
                                    <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{t('dashboard.doctorPrefix')} {appt.doctor_name}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{appt.reason}</p>
                                </div>
                                <div className="text-left sm:text-right mt-2 sm:mt-0">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{formatDate(appt.appointment_date)}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatTime(appt.appointment_date)}</p>
                                </div>
                            </li>
                        )) : <p className="text-gray-600 dark:text-gray-400 italic text-center py-4">{t('appointments.noUpcoming')}</p>}
                    </ul>
                </div>

                <div className="card p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('appointments.past')}</h2>
                    <ul className="space-y-4">
                        {pastAppointments.length > 0 ? pastAppointments.map(appt => (
                            <li key={appt.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center opacity-80">
                                <div>
                                    <p className="font-semibold text-lg text-gray-700 dark:text-gray-300">{t('dashboard.doctorPrefix')} {appt.doctor_name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{appt.reason}</p>
                                </div>
                                <div className="text-left sm:text-right mt-2 sm:mt-0">
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">{formatDate(appt.appointment_date)}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatTime(appt.appointment_date)}</p>
                                </div>
                            </li>
                        )) : <p className="text-gray-600 dark:text-gray-400 italic text-center py-4">{t('appointments.noPast')}</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const DoctorAppointmentsPage: React.FC = () => {
    const { isOffline } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

     useEffect(() => {
        const fetchAppointments = async () => {
            if (isOffline) {
                setAppointments(mockDoctorAppointments);
                setLoading(false);
                return;
            }
            const token = localStorage.getItem('streecare_token');
            try {
                const res = await fetch(`${API_BASE_URL}/appointments`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAppointments(data);
                } else {
                    console.error("Failed to fetch doctor appointments, response not OK:", res.status);
                }
            } catch (error) {
                console.error("Failed to fetch doctor appointments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [isOffline]);

    if (loading) return <p className="text-center text-gray-600 dark:text-gray-300 py-10">{t('appointments.loading')}</p>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 sm:p-8 animate-fade-in transition-colors duration-200">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">{t('appointments.scheduleTitle')}</h1>
            <div className="card p-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{t('appointments.allAppointments')}</h2>
                <div className="space-y-4">
                    {appointments.length > 0 ? appointments.map(appt => (
                         <div key={appt.id} className={`p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition-shadow duration-200 ${appt.status === 'confirmed' ? 'bg-[var(--color-secondary-50)] dark:bg-gray-700' : 'bg-yellow-50 dark:bg-gray-700'} border border-gray-200 dark:border-gray-700`}>
                            <div>
                                <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">{t('dashboard.patientPrefix')} {appt.patient_name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{appt.reason}</p>
                            </div>
                            <div className="text-left sm:text-right mt-2 sm:mt-0 flex items-center space-x-4">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{formatDate(appt.appointment_date)} at {formatTime(appt.appointment_date)}</p>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${appt.status === 'confirmed' ? 'text-green-800 bg-green-200 dark:bg-green-700 dark:text-green-100' : 'text-yellow-800 bg-yellow-200 dark:bg-yellow-700 dark:text-yellow-100'}`}>{appt.status}</span>
                            </div>
                         </div>
                    )) : <p className="text-gray-600 dark:text-gray-400 italic text-center py-4">{t('appointments.noAppointmentsFound')}</p>}
                </div>
            </div>
        </div>
    );
};

const AppointmentsPage: React.FC = () => {
    const { user } = useAuth();
    return (
      <div className="container mx-auto px-4 py-8">
        {user?.role === UserRole.PATIENT ? <PatientAppointmentsPage /> : <DoctorAppointmentsPage />}
      </div>
    );
};

export default AppointmentsPage;