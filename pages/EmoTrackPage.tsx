
import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../hooks/useAuth';
import { mockMusic } from '../services/mockData';

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

    const fetchMusic = async (mood: string) => {
        setSelectedMood(mood);
        setLoading(true);
        setRecommendations([]);
        
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        if (isOffline) {
            setRecommendations(mockMusic[mood as keyof typeof mockMusic] || []);
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('streecare_token');
        try {
            const res = await fetch(`${API_BASE_URL}/api/music?mood=${mood}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRecommendations(data);
            }
        } catch (error) {
            console.error("Failed to fetch music recommendations", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Emo Track</h1>
            <p className="text-gray-600 mb-6">How are you feeling today? Select a mood to get some music recommendations.</p>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Select Your Mood</h2>
                <div className="flex flex-wrap gap-4">
                    {moods.map(mood => (
                        <button 
                            key={mood.label}
                            onClick={() => fetchMusic(mood.label)}
                            className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-200 ${selectedMood === mood.label ? 'bg-rose-500 text-white shadow-lg scale-105' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            {mood.emoji} {mood.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <p>Finding some tunes for you...</p>}

            {selectedMood && !loading && recommendations.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Music For a {selectedMood} Mood</h2>
                    <ul className="space-y-3">
                        {recommendations.map((song, index) => (
                            <li key={index} className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                                <div>
                                    <p className="font-semibold">{song.title}</p>
                                    <p className="text-sm text-gray-500">{song.artist}</p>
                                </div>
                                <button className="text-rose-500 hover:text-rose-700">▶ Play</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default EmoTrackPage;