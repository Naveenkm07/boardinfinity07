'use client';

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, JwtPayload, AuthState } from '@/types';
import { authService } from '@/services/auth.service';

/**
 * Auth Context — manages authentication state globally.
 *
 * State management approach:
 * - Token is stored in localStorage for persistence across page reloads
 * - User data is decoded from JWT payload + fetched from API
 * - isLoading is true during initial token validation
 * - Auto-logout when token expires
 */

interface AuthContextValue extends AuthState {
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Check if a JWT token is still valid (not expired).
     */
    const isTokenValid = useCallback((t: string): boolean => {
        try {
            const decoded = jwtDecode<JwtPayload>(t);
            // Check if token expires within the next 60 seconds
            return decoded.exp * 1000 > Date.now() + 60000;
        } catch {
            return false;
        }
    }, []);

    /**
     * Initialize auth state from localStorage on mount.
     */
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedToken = localStorage.getItem('auth_token');

                if (storedToken && isTokenValid(storedToken)) {
                    setToken(storedToken);

                    // Fetch fresh user data from the API
                    const response = await authService.getMe();

                    if (response.success && response.data?.user) {
                        setUser(response.data.user);
                    } else {
                        // Token is valid but user fetch failed — clear state
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user');
                    }
                } else {
                    // Token expired or missing — clear state
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                }
            } catch {
                // Network error or API error — clear auth state
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [isTokenValid]);

    /**
     * Login — store token and user data.
     */
    const login = useCallback((newToken: string, newUser: User) => {
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    }, []);

    /**
     * Logout — clear all auth state.
     */
    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    /**
     * Update user data (e.g., after profile edit).
     */
    const updateUser = useCallback((updatedUser: User) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    }, []);

    const isAuthenticated = !!token && !!user;

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            isAuthenticated,
            isLoading,
            login,
            logout,
            updateUser,
        }),
        [user, token, isAuthenticated, isLoading, login, logout, updateUser],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
