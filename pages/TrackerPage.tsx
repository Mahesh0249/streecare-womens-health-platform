
import React, { useState, useEffect } from 'react';
import type { MenstrualLog } from '../types';
import { API_BASE_URL } from '../config';
import { useAuth } from '../hooks/useAuth';
import { mockMenstrualLogs } from '../services/mockData';

const CalendarDay: React.FC<{ day: number | null; isPeriod?: boolean; isOvulation?: boolean }> = ({ day, isPeriod, isOvulation }) => {
    let bgClass = 'bg-white';
    if (isPeriod) bgClass = 'bg-rose-200';
    if (isOvulation) bgClass = 'bg-teal-200';
    
    return (
        <div className={`h-24 border border-gray-200 flex flex-col p-2 ${!day ? 'bg-gray-50' : bgClass}`}>
            {day && <span className="self-end text-sm">{day}</span>}
        </div>
    );
};

const LogPeriodModal: React.FC<{ onClose: () => void; onSave: (log: { start_date: string; end_date: string }) => void }> = ({ onClose, onSave }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ start_date: startDate, end_date: endDate });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4">Log New Period</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const TrackerPage: React.FC = () => {
    const { user, isOffline } = useAuth();
    const [month, setMonth] = useState(new Date());
    const [logs, setLogs] = useState<MenstrualLog[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const fetchLogs = async () => {
        if (isOffline) {
            setLogs(mockMenstrualLogs);
            return;
        }
        const token = localStorage.getItem('streecare_token');
        try {
            const res = await fetch(`${API_BASE_URL}/api/menstrual/logs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Failed to fetch logs", error);
        }
    };
    
    useEffect(() => {
        fetchLogs();
    }, [isOffline]);

    const handleSaveLog = async (log: { start_date: string; end_date: string }) => {
        if (isOffline) {
            const newLog: MenstrualLog = {
                id: `mock_${Date.now()}`,
                user_id: user!.id,
                ...log
            };
            setLogs(prev => [newLog, ...prev].sort((a,b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()));
            setIsModalOpen(false);
            return;
        }

        const token = localStorage.getItem('streecare_token');
        try {
            await fetch(`${API_BASE_URL}/api/menstrual/logs`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(log)
            });
            fetchLogs(); // Refetch logs after saving
            setIsModalOpen(false);
        } catch (error) {
             console.error("Failed to save log", error);
        }
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const numDays = endDate.getDate();
    const startDayOfWeek = startDate.getDay();
    
    const calendarDays = Array.from({ length: startDayOfWeek }, () => null);
    for (let i = 1; i <= numDays; i++) {
        calendarDays.push(i);
    }

    const isPeriodDay = (day: number) => {
        const currentDate = new Date(month.getFullYear(), month.getMonth(), day);
        return logs.some(log => {
            const start = new Date(log.start_date);
            const end = new Date(log.end_date);
            // Adjust for timezone differences
            start.setMinutes(start.getMinutes() + start.getTimezoneOffset());
            end.setMinutes(end.getMinutes() + end.getTimezoneOffset());
            return currentDate >= start && currentDate <= end;
        });
    };

    return (
        <div>
            {isModalOpen && <LogPeriodModal onClose={() => setIsModalOpen(false)} onSave={handleSaveLog} />}
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Menstrual Tracker</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{month.toLocaleString('default', { month: 'long' })} {month.getFullYear()}</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600">Log Period</button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map(day => <div key={day} className="text-center font-semibold text-gray-600 p-2">{day}</div>)}
                    {calendarDays.map((day, index) => (
                        <CalendarDay 
                            key={index} 
                            day={day} 
                            isPeriod={day ? isPeriodDay(day) : false}
                        />
                    ))}
                </div>
                <div className="mt-6 flex space-x-4">
                    <div className="flex items-center"><div className="w-4 h-4 bg-rose-200 mr-2 rounded"></div>Period</div>
                    {/* <div className="flex items-center"><div className="w-4 h-4 bg-teal-200 mr-2 rounded"></div>Predicted Ovulation</div> */}
                </div>
            </div>
        </div>
    );
};

export default TrackerPage;