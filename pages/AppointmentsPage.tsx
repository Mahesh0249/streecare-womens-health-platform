
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{t('bookAppointment.title')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">{t('bookAppointment.doctor')}</label>
                        <select
                            id="doctor"
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        >
                            <option value="" disabled>Select a doctor</option>
                            {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">{t('bookAppointment.date')}</label>
                        <input
                            type="datetime-local"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">{t('bookAppointment.reason')}</label>
                        <input
                            type="text"
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            placeholder={t('bookAppointment.reason.placeholder')}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">{t('form.cancel')}</button>
                        <button type="submit" disabled={isBooking} className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:bg-rose-300">
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
        const token = localStorage.getItem('streecare_token');
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };
    
    const fetchDoctors = async () => {
         const token = localStorage.getItem('streecare_token');
        try {
            const res = await fetch(`${API_BASE_URL}/api/appointments/doctors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDoctors(data);
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
            const res = await fetch(`${API_BASE_URL}/api/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(details)
            });

            if (!res.ok) {
                throw new Error(await res.json().then(d => d.message) || t('bookAppointment.error'));
            }
            setSuccess(t('bookAppointment.success'));
            fetchAppointments(); // Refresh the list
        } catch (err: any) {
            setError(err.message);
        }
    };

    const upcomingAppointments = appointments.filter(a => new Date(a.appointment_date) >= new Date());
    const pastAppointments = appointments.filter(a => new Date(a.appointment_date) < new Date());

    if (loading) return <p>Loading appointments...</p>;

    return (
        <div>
            {isModalOpen && <BookAppointmentModal doctors={doctors} onClose={() => setIsModalOpen(false)} onBook={handleBookAppointment} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('nav.appointments')}</h1>
            
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Upcoming</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600">{t('appointments.bookNew')}</button>
                </div>
                <ul className="space-y-4">
                    {upcomingAppointments.length > 0 ? upcomingAppointments.map(appt => (
                        <li key={appt.id} className="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                                <p className="font-semibold">Dr. {appt.doctor_name}</p>
                                <p className="text-sm text-gray-500">{appt.reason}</p>
                            </div>
                            <div>
                                <p className="font-semibold">{formatDate(appt.appointment_date)}</p>
                                <p className="text-sm text-gray-500 text-right">{formatTime(appt.appointment_date)}</p>
                            </div>
                        </li>
                    )) : <p className="text-gray-500">No upcoming appointments.</p>}
                </ul>
                <h2 className="text-xl font-semibold mt-8 mb-4">Past</h2>
                <ul className="space-y-4">
                    {pastAppointments.length > 0 ? pastAppointments.map(appt => (
                        <li key={appt.id} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                            <div>
                                <p className="font-semibold text-gray-500">Dr. {appt.doctor_name}</p>
                                <p className="text-sm text-gray-400">{appt.reason}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-500">{formatDate(appt.appointment_date)}</p>
                                <p className="text-sm text-gray-400 text-right">{formatTime(appt.appointment_date)}</p>
                            </div>
                        </li>
                    )) : <p className="text-gray-500">No past appointments.</p>}
                </ul>
            </div>
        </div>
    );
};

const DoctorAppointmentsPage: React.FC = () => {
    const { isOffline } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchAppointments = async () => {
            if (isOffline) {
                setAppointments(mockDoctorAppointments);
                setLoading(false);
                return;
            }
            const token = localStorage.getItem('streecare_token');
            try {
                const res = await fetch(`${API_BASE_URL}/api/appointments`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAppointments(data);
                }
            } catch (error) {
                console.error("Failed to fetch appointments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, [isOffline]);

    if (loading) return <p>Loading schedule...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointment Schedule</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">All Appointments</h2>
                <div className="space-y-3">
                    {appointments.length > 0 ? appointments.map(appt => (
                         <div key={appt.id} className={`p-4 rounded-lg flex justify-between items-center ${appt.status === 'confirmed' ? 'bg-rose-50' : 'bg-yellow-50'}`}>
                            <div>
                                <p><strong>{appt.patient_name}</strong></p>
                                <p className="text-sm">{formatDate(appt.appointment_date)} at {formatTime(appt.appointment_date)}</p>
                            </div>
                            <span className="capitalize">{appt.status}</span>
                         </div>
                    )) : <p className="text-gray-500">No appointments found.</p>}
                </div>
            </div>
        </div>
    )
}

const AppointmentsPage: React.FC = () => {
    const { user } = useAuth();
    return user?.role === UserRole.PATIENT ? <PatientAppointmentsPage /> : <DoctorAppointmentsPage />;
};

export default AppointmentsPage;