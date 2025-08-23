
import React, { useState, useEffect } from 'react';
import type { ForumPost } from '../types';
import { API_BASE_URL } from '../config';
import { useAuth } from '../hooks/useAuth';
import { mockForumPosts } from '../services/mockData';
import { useTranslation } from '../hooks/useTranslation';
import { Link } from 'react-router-dom';

const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
};

const CreatePostModal: React.FC<{ onClose: () => void; onSave: (post: { title: string; content: string }) => void }> = ({ onClose, onSave }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, content });
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">{t('forum.createPostTitle')}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('forum.postTitle')}</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] p-3" />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('forum.postContent')}</label>
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={5} required className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] p-3" />
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium">{t('form.cancel')}</button>
                        <button type="submit" className="px-6 py-3 bg-[var(--color-primary-500)] text-white rounded-lg hover:bg-[var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium">{t('form.post')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ForumPage: React.FC = () => {
    const { isOffline } = useAuth();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const fetchPosts = async () => {
        if (isOffline) {
            setPosts(mockForumPosts);
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('streecare_token');
        try {
            setLoading(true);
            setError(null);
            console.log("Attempting to fetch forum posts...");
            const res = await fetch(`${API_BASE_URL}/forum/posts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
                console.log("Forum posts fetched successfully:", data);
            } else {
                const errorData = await res.json();
                const errorMessage = errorData.message || t('forum.fetchError');
                console.error("API Error fetching posts:", res.status, errorMessage);
                setError(errorMessage);
            }
        } catch (error: any) {
            console.error("Network or unexpected error fetching posts:", error);
            setError(error.message || t('forum.fetchError'));
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPosts();
    }, [isOffline]);

    const handleSavePost = async (post: { title: string; content: string }) => {
        setError(null);
        if (isOffline) {
            const newPost: ForumPost = {
                id: `mock_${Date.now()}`,
                created_at: new Date().toISOString(),
                ...post,
                author_name: 'Anonymous', // Mock author
            };
            setPosts(prev => [newPost, ...prev]);
            setIsModalOpen(false);
            return;
        }

        const token = localStorage.getItem('streecare_token');
        try {
            console.log("Attempting to save new forum post:", post);
            const res = await fetch(`${API_BASE_URL}/forum/posts`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(post)
            });

            if (res.ok) {
                console.log("Post saved successfully. Refetching posts...");
                fetchPosts(); // Refetch posts to include the new one
                setIsModalOpen(false);
            } else {
                const errorData = await res.json();
                const errorMessage = errorData.message || t('forum.postError');
                console.error("API Error saving post:", res.status, errorMessage);
                setError(errorMessage);
            }
        } catch (error: any) {
             console.error("Network or unexpected error saving post:", error);
             setError(error.message || t('forum.postError'));
        }
    };


    if (loading) return <p className="text-center text-gray-600 dark:text-gray-300 py-4">{t('forum.loadingPosts')}</p>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 sm:p-8 animate-fade-in transition-colors duration-200">
            {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} onSave={handleSavePost} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{t('nav.forum')}</h1>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary text-base px-5 py-2">{t('forum.createNewPost')}</button>
            </div>
            {error && <p className="text-center text-red-500 dark:text-red-400 py-4">{error}</p>}
            <div className="space-y-6">
                {posts.length > 0 ? posts.map(post => (
                    <div key={post.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{post.title}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('forum.postedBy')} {post.author_name || 'Anonymous'} &bull; {timeAgo(post.created_at)}</p>
                        <p className="text-gray-700 dark:text-gray-300 mt-3 line-clamp-3">{post.content}</p>
                        <div className="mt-4">
                            <Link to={`/forum/${post.id}`} className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] dark:hover:text-[var(--color-primary-300)] font-semibold transition-colors duration-200">{t('forum.viewPost')}</Link>
                        </div>
                    </div>
                )) : <p className="text-gray-600 dark:text-gray-400 italic text-center py-4">{t('forum.noPostsFound')}</p>}
            </div>
        </div>
    );
};

export default ForumPage;