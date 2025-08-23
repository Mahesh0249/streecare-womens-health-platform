
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { API_BASE_URL } from '../config';
import type { MenstrualLog } from '../types';
import { mockMenstrualLogs } from '../services/mockData';

const CalendarDay: React.FC<{ day: number | null; isPeriod?: boolean; isOvulation?: boolean }> = ({ day, isPeriod }) => {
    let bgClass = 'bg-white';
    if (isPeriod) bgClass = 'bg-rose-200';
    
    return (
        <div className={`h-24 border border-gray-200 dark:border-gray-700 flex flex-col p-2 ${!day ? 'bg-gray-50 dark:bg-gray-800' : bgClass}`}>
            {day && <span className="self-end text-sm text-gray-800 dark:text-gray-200">{day}</span>}
        </div>
    );
};

const LogPeriodModal: React.FC<{
    onClose: () => void;
    onSave: (log: { start_date: string; end_date: string }) => void;
}> = ({ onClose, onSave }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ start_date: startDate, end_date: endDate });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Log Period</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-rose-500 focus:ring-rose-500 p-2" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-rose-500 focus:ring-rose-500 p-2" />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">Save</button>
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
    const { t } = useTranslation();
    
    console.log('TrackerPage: Component rendered, user:', user, 'isOffline:', isOffline);
    
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

    const changeMonth = (direction: 'prev' | 'next') => {
        setMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else {
                newMonth.setMonth(prev.getMonth() + 1);
            }
            return newMonth;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 animate-fade-in transition-colors duration-200">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">Menstrual Tracker</h1>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <button 
                            onClick={() => changeMonth('prev')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {month.toLocaleString('en', { month: 'long' })} {month.getFullYear()}
                        </h2>
                        
                        <button 
                            onClick={() => changeMonth('next')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {days.map(day => (
                            <div key={day} className="text-center font-semibold text-gray-700 dark:text-gray-300 p-2">
                                {day}
                            </div>
                        ))}
                        {calendarDays.map((day, index) => (
                            <CalendarDay 
                                key={index} 
                                day={day} 
                                isPeriod={day !== null ? isPeriodDay(day) : false}
                            />
                        ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-4 text-gray-700 dark:text-gray-300">
                            <div className="flex items-center">
                                <div className="w-4 h-4 bg-rose-200 dark:bg-rose-700 mr-2 rounded"></div>
                                Period
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors duration-200 font-medium"
                        >
                            Log Period
                        </button>
                    </div>
                </div>
            </div>
            
            {isModalOpen && <LogPeriodModal onClose={() => setIsModalOpen(false)} onSave={handleSaveLog} />}
        </div>
    );
};

export default TrackerPage;