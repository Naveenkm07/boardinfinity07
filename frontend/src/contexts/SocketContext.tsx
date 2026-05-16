'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    link?: string;
    read: boolean;
}

interface SocketContextType {
    socket: Socket | null;
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (user) {
            const newSocket = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket'],
            });

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                newSocket.emit('join', user.id || (user as any)._id);
            });

            newSocket.on('notification', (payload: any) => {
                setNotifications(prev => [
                    { ...payload, read: false },
                    ...prev
                ].slice(0, 50)); // Keep last 50
                
                // Show browser notification if permitted
                if (Notification.permission === 'granted') {
                    new Notification(payload.title, {
                        body: payload.message,
                        icon: '/logo.png'
                    });
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user]);

    // Request browser notification permission
    useEffect(() => {
        if (typeof window !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <SocketContext.Provider value={{ socket, notifications, unreadCount, markAsRead, clearAll }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
