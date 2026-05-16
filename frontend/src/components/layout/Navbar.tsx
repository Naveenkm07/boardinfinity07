'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/contexts/NotificationContext';
import Link from 'next/link';

export const Navbar: React.FC = () => {
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6 relative z-50">
            <div>
                <h1 className="text-lg font-semibold text-gray-900">
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span className="text-xl">🔔</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="text-xs text-primary-600 font-bold hover:underline"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div 
                                            key={n.id} 
                                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${!n.isRead ? 'bg-primary-50/30' : ''}`}
                                            onClick={() => {
                                                if (!n.isRead) markAsRead(n.id);
                                            }}
                                        >
                                            <div className="flex gap-3">
                                                <div className="text-xl">
                                                    {n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : 'ℹ️'}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{n.title}</h4>
                                                    <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                                                    <p className="text-[10px] text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                                                    {n.link && (
                                                        <Link href={n.link} className="inline-block mt-2 text-xs font-bold text-primary-600 hover:underline">
                                                            View Details →
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        No notifications yet
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User avatar */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-bold">
                            {user?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name}</span>
                </div>
            </div>
        </header>
    );
};
