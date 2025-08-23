
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
            const response = await fetch(`${API_BASE_URL}/health`); // Corrected URL
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
                    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
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

    const login = async (email: string, password: string, role: UserRole) => {
        if (isOffline) {
            console.log("Offline mode: Simulating login.");
            if (role === UserRole.DOCTOR) {
                setUser(mockDoctorUser);
            } else {
                setUser(mockPatientUser);
            }
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
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
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
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

    const updateUserProfile = async (updatedUser: User) => {
        if (isOffline) {
            console.log("Offline mode: Simulating update profile.");
            setUser(updatedUser);
            return;
        }

        try {
            const token = localStorage.getItem('streecare_token');
            if (!token) {
                throw new Error("No token found for profile update.");
            }
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                return data.user;
            } else {
                const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
                throw new Error(errorData.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update profile request failed:", error);
            throw new Error("Unable to connect to the server. Please check your network connection.");
        }
    };

    const changeUserPassword = async (currentPassword: string, newPassword: string) => {
        if (isOffline) {
            console.log("Offline mode: Simulating password change.");
            // In a real app, you'd hash the new password and save it.
            // For now, we'll just simulate the change.
            return;
        }

        try {
            const token = localStorage.getItem('streecare_token');
            if (!token) {
                throw new Error("No token found for password change.");
            }
            const response = await fetch(`${API_BASE_URL}/auth/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                // Optionally, clear token on successful password change
                localStorage.removeItem('streecare_token');
                setUser(null);
                return data;
            } else {
                const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
                throw new Error(errorData.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Change password request failed:", error);
            throw new Error("Unable to connect to the server. Please check your network connection.");
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, isOffline, isCheckingStatus, retryConnection: checkServerStatus, updateUserProfile, changeUserPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;