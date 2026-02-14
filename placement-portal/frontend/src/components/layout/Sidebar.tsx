'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';

/**
 * Sidebar navigation component for the dashboard layout.
 */
export const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    const studentLinks = [
        { href: '/student', label: 'Dashboard', icon: '📊' },
        { href: '/student/profile', label: 'My Profile', icon: '👤' },
        { href: '/student/placements', label: 'Placements', icon: '🏢' },
        { href: '/student/applications', label: 'Applications', icon: '📋' },
    ];

    const adminLinks = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/students', label: 'Students', icon: '👥' },
        { href: '/admin/companies', label: 'Companies', icon: '🏢' },
        { href: '/admin/placements', label: 'Placements', icon: '📋' },
        { href: '/admin/reports', label: 'Reports', icon: '📈' },
    ];

    const links = user?.role === UserRole.ADMIN ? adminLinks : studentLinks;

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-gray-200 min-h-screen flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    🎓 Placement Portal
                </h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 group"
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                        <span className="font-medium">{link.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User info + Logout */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold">
                            {user?.name?.charAt(0).toUpperCase() || '?'}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
