
import React, { useState, useEffect } from 'react';
import type { ForumPost } from '../types';
import { API_BASE_URL } from '../config';
import { useAuth } from '../hooks/useAuth';
import { mockForumPosts } from '../services/mockData';

const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const CreatePostModal: React.FC<{ onClose: () => void; onSave: (post: { title: string; content: string }) => void }> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, content });
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={5} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500" />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600">Post</button>
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

    const fetchPosts = async () => {
        if (isOffline) {
            setPosts(mockForumPosts);
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('streecare_token');
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/forum/posts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPosts();
    }, [isOffline]);

    const handleSavePost = async (post: { title: string; content: string }) => {
        if (isOffline) {
            const newPost: ForumPost = {
                id: `mock_${Date.now()}`,
                created_at: new Date().toISOString(),
                ...post
            };
            setPosts(prev => [newPost, ...prev]);
            setIsModalOpen(false);
            return;
        }

        const token = localStorage.getItem('streecare_token');
        try {
            await fetch(`${API_BASE_URL}/api/forum/posts`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(post)
            });
            fetchPosts(); // Refetch posts
            setIsModalOpen(false);
        } catch (error) {
             console.error("Failed to save post", error);
        }
    };


    if (loading) return <p>Loading forum...</p>;

    return (
        <div>
            {isModalOpen && <CreatePostModal onClose={() => setIsModalOpen(false)} onSave={handleSavePost} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Community Forum</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600">Create New Post</button>
            </div>
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
                        <p className="text-sm text-gray-500 mt-1">Posted by Anonymous • {timeAgo(post.created_at)}</p>
                        <p className="text-gray-600 mt-3 line-clamp-2">{post.content}</p>
                        <div className="mt-4">
                            <span className="text-rose-600 font-semibold cursor-pointer">View Post</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForumPage;