
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User, AuthContextType, UserRole } from '../types';
import { API_BASE_URL } from '../config';
import { mockPatientUser, mockDoctorUser } from '../services/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // For user auth check
    const [isOffline, setIsOffline] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    const checkServerStatus = useCallback(async () => {
        setIsCheckingStatus(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/health`);
            if (!response.ok) throw new Error('Server not healthy');
            setIsOffline(false);
        } catch (error) {
            console.error("Server health check failed:", error);
            setIsOffline(true);
        } finally {
            setIsCheckingStatus(false);
        }
    }, []);

    useEffect(() => {
        checkServerStatus();
    }, [checkServerStatus]);

    useEffect(() => {
        const checkUser = async () => {
            setLoading(true);
            if (isOffline) {
                setUser(null);
                localStorage.removeItem('streecare_token');
                setLoading(false);
                return;
            }
            
            const token = localStorage.getItem('streecare_token');
            if (token) {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                    } else {
                        localStorage.removeItem('streecare_token');
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                    localStorage.removeItem('streecare_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        if (!isCheckingStatus) {
            checkUser();
        }
    }, [isOffline, isCheckingStatus]);

    const login = async (email: string, password: string) => {
        if (isOffline) {
            console.log("Offline mode: Simulating login.");
            if (email.toLowerCase().includes('doctor')) {
                setUser(mockDoctorUser);
            } else {
                setUser(mockPatientUser);
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('streecare_token', data.token);
                setUser(data.user);
            } else {
                const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
                throw new Error(errorData.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Login request failed:", error);
            throw new Error("Unable to connect to the server. Please check your network connection.");
        }
    };

    const signup = async (name: string, email: string, password: string, role: UserRole) => {
        if (isOffline) {
            console.log("Offline mode: Simulating signup.");
            const newUser = {
                id: `mock_${Date.now()}`,
                name,
                email,
                role
            };
            setUser(newUser);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('streecare_token', data.token);
                setUser(data.user);
            } else {
                const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
                throw new Error(errorData.message || "Failed to register");
            }
        } catch (error) {
            console.error("Signup request failed:", error);
            throw new Error("Unable to connect to the server. Please check your network connection.");
        }
    };

    const logout = () => {
        localStorage.removeItem('streecare_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, isOffline, isCheckingStatus, retryConnection: checkServerStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;