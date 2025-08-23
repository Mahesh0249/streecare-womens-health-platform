import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { API_BASE_URL } from '../config';

interface LiveMeeting {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number;
    maxParticipants: number;
    currentParticipants: number;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    meetingLink?: string;
    topics: string[];
    doctor_id: string;
    doctor_name: string;
}

const PatientMeetingsPage: React.FC = () => {
    const [meetings, setMeetings] = useState<LiveMeeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'live'>('all');

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const token = localStorage.getItem('streecare_token');
            const response = await fetch(`${API_BASE_URL}/api/meetings/patient`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setMeetings(data.meetings || []);
            }
        } catch (error) {
            console.error('Failed to fetch meetings:', error);
        } finally {
            setLoading(false);
        }
    };

    const joinMeeting = async (meetingId: string) => {
        try {
            const token = localStorage.getItem('streecare_token');
            const response = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}/join`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                // Join the meeting
                window.open(data.meetingLink, '_blank');
                fetchMeetings(); // Refresh to update participant count
            }
        } catch (error) {
            console.error('Failed to join meeting:', error);
        }
    };

    const filteredMeetings = meetings.filter(meeting => {
        if (filter === 'upcoming') {
            return meeting.status === 'scheduled';
        } else if (filter === 'live') {
            return meeting.status === 'live';
        }
        return true;
    });

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
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                        Live Awareness Sessions
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Join live sessions conducted by healthcare professionals to learn about women's health
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-sm mb-8">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                            filter === 'all'
                                ? 'bg-rose-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        All Sessions
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                            filter === 'upcoming'
                                ? 'bg-rose-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('live')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                            filter === 'live'
                                ? 'bg-rose-600 text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        Live Now
                    </button>
                </div>

                {/* Meetings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMeetings.map((meeting) => (
                        <div key={meeting.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        {meeting.title}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                        meeting.status === 'live' ? 'bg-green-100 text-green-800' :
                                        meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {meeting.status === 'live' ? 'LIVE NOW' : meeting.status}
                                    </span>
                                </div>
                                
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {meeting.description}
                                </p>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(meeting.date).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {meeting.time} ({meeting.duration} min)
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Dr. {meeting.doctor_name}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {meeting.currentParticipants}/{meeting.maxParticipants} participants
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topics:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {meeting.topics.map((topic, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                    {meeting.status === 'live' && (
                                        <button
                                            onClick={() => joinMeeting(meeting.id)}
                                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                                        >
                                            Join Live Session
                                        </button>
                                    )}
                                    {meeting.status === 'scheduled' && (
                                        <button
                                            onClick={() => joinMeeting(meeting.id)}
                                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                                        >
                                            Join Session
                                        </button>
                                    )}
                                    <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium">
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredMeetings.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No meetings available</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {filter === 'upcoming' ? 'No upcoming sessions scheduled.' :
                             filter === 'live' ? 'No live sessions at the moment.' :
                             'No awareness sessions available at the moment.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientMeetingsPage;
