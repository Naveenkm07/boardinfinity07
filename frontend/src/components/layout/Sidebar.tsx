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
        { href: '/dashboard', label: 'Overview', icon: '📊' },
        { href: '/student/tracks', label: 'Prep Tracks', icon: '🛤️' },
        { href: '/student/courses', label: 'My Courses', icon: '📚' },
        { href: '/student/coding', label: 'Coding Practice', icon: '💻' },
        { href: '/student/interview', label: 'AI Mock Interview', icon: '🤖' },
        { href: '/student/video-interview', label: 'P2P Mock Interview', icon: '📹' },
        { href: '/student/experiences', label: 'Interview Forum', icon: '💬' },
        { href: '/student/leaderboard', label: 'Hall of Fame', icon: '🏆' },
        { href: '/profile', label: 'My Profile', icon: '👤' },
    ];

    const adminLinks = [
        { href: '/admin', label: 'Admin Panel', icon: '⚡' },
        { href: '/admin/jobs', label: 'Job Postings', icon: '💼' },
        { href: '/student/tracks', label: 'Prep Tracks', icon: '🛤️' },
        { href: '/student/coding', label: 'Coding Practice', icon: '💻' },
        { href: '/student/interview', label: 'AI Mock Interview', icon: '🤖' },
        { href: '/student/video-interview', label: 'P2P Mock Interview', icon: '📹' },
        { href: '/student/experiences', label: 'Interview Forum', icon: '💬' },
        { href: '/student/leaderboard', label: 'Hall of Fame', icon: '🏆' },
        { href: '/profile', label: 'My Profile', icon: '👤' },
    ];

    const links = user?.role === UserRole.ADMIN ? adminLinks : studentLinks;

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    <span className="text-xl font-black text-indigo-600 tracking-tighter uppercase">Board Infinity</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                        <span className="text-lg">{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="w-full px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-3"
                >
                    <span>🚪</span>
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
