import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';

const ProfilePage: React.FC = () => {
    const { user, updateUserProfile } = useAuth();
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            try {
                await updateUserProfile({
                    ...user,
                    ...formData
                });
                setIsEditing(false);
            } catch (error) {
                console.error('Failed to update profile:', error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!user) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-300">Please log in to view your profile.</p>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 sm:p-8 animate-fade-in transition-colors duration-200">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">Profile Details</h1>
                
                <div className="card p-8">
                    {!isEditing ? (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <img 
                                    src={`https://picsum.photos/seed/${user.id}/80/80`} 
                                    alt="Profile" 
                                    className="w-20 h-20 rounded-full border-4 border-rose-500"
                                />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{user.name}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 capitalize">Role: {user.role}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                                    <p className="text-gray-900 dark:text-gray-100 text-lg">{user.name}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                    <p className="text-gray-900 dark:text-gray-100 text-lg">{user.email}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User ID</label>
                                    <p className="text-gray-900 dark:text-gray-100 text-lg font-mono">{user.id}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="btn-primary px-6 py-3"
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    required
                                />
                            </div>
                            
                            <div className="flex space-x-4">
                                <button 
                                    type="submit"
                                    className="btn-primary px-6 py-3"
                                >
                                    Save Changes
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: user.name,
                                            email: user.email,
                                        });
                                    }}
                                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
