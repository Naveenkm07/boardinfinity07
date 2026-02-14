'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * Top navbar for the dashboard layout.
 */
export const Navbar: React.FC = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 flex items-center justify-between px-6">
            <div>
                <h1 className="text-lg font-semibold text-gray-900">
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications placeholder */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <span className="text-xl">🔔</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User avatar */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
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
