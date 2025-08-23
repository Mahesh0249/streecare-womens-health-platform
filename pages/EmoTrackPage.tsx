
import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../hooks/useAuth';
import { mockMusic } from '../services/mockData';
import { useTranslation } from '../hooks/useTranslation'; // Import useTranslation

const moods = [
    { label: 'Happy', emoji: '😊' },
    { label: 'Sad', emoji: '😢' },
    { label: 'Anxious', emoji: '😟' },
    { label: 'Energetic', emoji: '⚡' },
    { label: 'Calm', emoji: '😌' }
];

interface Song {
    title: string;
    artist: string;
}

const EmoTrackPage: React.FC = () => {
    const { isOffline } = useAuth();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation(); // Initialize useTranslation
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchMusic = async (mood: string) => {
        setSelectedMood(mood);
        setLoading(true);
        setRecommendations([]);
        setFetchError(null);
        
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        if (isOffline) {
            setRecommendations(mockMusic[mood as keyof typeof mockMusic] || []);
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('streecare_token');
        try {
            console.log(`Attempting to fetch music for mood: ${mood}`);
            const res = await fetch(`${API_BASE_URL}/music?mood=${mood}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                console.log("Music recommendations fetched successfully:", data);
                setRecommendations(data);
            } else {
                const errorData = await res.json();
                const errorMessage = errorData.message || `Failed to fetch music for ${mood}.`;
                console.error("API Error fetching music:", res.status, errorMessage);
                setFetchError(errorMessage);
            }
        } catch (error: any) {
            console.error("Network or unexpected error fetching music:", error);
            setFetchError(error.message || t('emotrack.fetchError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-full p-6 rounded-lg shadow-inner">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('nav.emotrack')}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{t('emotrack.description')}</p>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('emotrack.selectMood')}</h2>
                <div className="flex flex-wrap gap-4">
                    {moods.map(mood => (
                        <button 
                            key={mood.label}
                            onClick={() => fetchMusic(mood.label)}
                            className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200 ${selectedMood === mood.label ? 'bg-[var(--color-primary-500)] text-white shadow-lg scale-105 hover:bg-[var(--color-primary-600)] dark:bg-[var(--color-primary-700)] dark:hover:bg-[var(--color-primary-600)]' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
                        >
                            {mood.emoji} {t(`emotrack.moods.${mood.label.toLowerCase()}`)}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <p className="text-center text-gray-600 dark:text-gray-300 py-4">{t('emotrack.loadingMusic')}</p>}
            {fetchError && <p className="text-center text-red-500 dark:text-red-400 py-4">{fetchError}</p>}

            {selectedMood && !loading && !fetchError && recommendations.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('emotrack.musicForMood', { mood: t(`emotrack.moods.${selectedMood.toLowerCase()}`) })}</h2>
                    <ul className="space-y-3">
                        {recommendations.map((song, index) => (
                            <li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{song.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{song.artist}</p>
                                </div>
                                <button className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] dark:hover:text-[var(--color-primary-300)] transition-colors duration-200">▶ {t('emotrack.playButton')}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedMood && !loading && !fetchError && recommendations.length === 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 italic py-4">{t('emotrack.noMusicFound')}</p>
            )}
        </div>
    );
};

export default EmoTrackPage;