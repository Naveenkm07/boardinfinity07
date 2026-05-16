'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '../../../services/admin.service';
import { AdminAnalytics, User } from '../../../types';

export default function AdminDashboardPage() {
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [page, setPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'overview' | 'users'>('overview');

    useEffect(() => {
        adminService.getAnalytics().then(setAnalytics).catch(console.error).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (tab === 'users') fetchUsers();
    }, [tab, page, roleFilter]);

    async function fetchUsers() {
        try {
            const data = await adminService.listUsers(page, 20, roleFilter || undefined);
            setUsers(data.users);
            setTotalUsers(data.total);
        } catch (err) {
            console.error('Failed to load users:', err);
        }
    }

    async function handleRoleChange(userId: string, newRole: string) {
        try {
            await adminService.updateUserRole(userId, newRole);
            fetchUsers();
        } catch (err) {
            console.error('Failed to update role:', err);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab('overview')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setTab('users')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === 'users' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        User Management
                    </button>
                </div>
            </div>

            {tab === 'overview' ? (
                <div className="space-y-6">
                    {/* Analytics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Users', value: analytics?.totalUsers ?? 0, icon: '👥', color: 'from-blue-500 to-blue-600' },
                            { label: 'Students', value: analytics?.totalStudents ?? 0, icon: '🎓', color: 'from-green-500 to-green-600' },
                            { label: 'Courses', value: analytics?.totalCourses ?? 0, icon: '📚', color: 'from-purple-500 to-purple-600' },
                            { label: 'Assessments', value: analytics?.totalAssessments ?? 0, icon: '📝', color: 'from-orange-500 to-orange-600' },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-2xl shadow-lg`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Avg Progress */}
                        <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4">📊 Platform Progress</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Average Course Completion</span>
                                        <span className="font-bold">{analytics?.averageProgress?.toFixed(1) ?? 0}%</span>
                                    </div>
                                    <div className="h-3 w-full rounded-full bg-gray-100">
                                        <div
                                            className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                                            style={{ width: `${analytics?.averageProgress ?? 0}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="p-4 rounded-lg bg-indigo-50 text-center">
                                        <p className="text-2xl font-bold text-indigo-600">{analytics?.totalSessions ?? 0}</p>
                                        <p className="text-xs text-gray-500">Total Sessions</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-purple-50 text-center">
                                        <p className="text-2xl font-bold text-purple-600">{analytics?.totalAdmins ?? 0}</p>
                                        <p className="text-xs text-gray-500">Admins</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Signups */}
                        <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4">🆕 Recent Signups</h2>
                            <div className="space-y-3">
                                {analytics?.recentSignups?.map((user: any) => (
                                    <div key={user._id || user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{user.name || 'Unnamed'}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                )) || <p className="text-gray-400 text-sm">No recent signups.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* User Management Tab */
                <div className="space-y-4">
                    <div className="flex gap-2">
                        {['', 'student', 'admin'].map((r) => (
                            <button
                                key={r}
                                onClick={() => { setRoleFilter(r); setPage(1); }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${roleFilter === r ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {r || 'All'}
                            </button>
                        ))}
                        <span className="ml-auto text-sm text-gray-400">{totalUsers} users</span>
                    </div>

                    <div className="rounded-xl bg-white border border-gray-100 shadow-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-3 font-medium text-gray-500">User</th>
                                    <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                                    <th className="text-left px-6 py-3 font-medium text-gray-500">Department</th>
                                    <th className="text-left px-6 py-3 font-medium text-gray-500">Role</th>
                                    <th className="text-left px-6 py-3 font-medium text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user: any) => (
                                    <tr key={user._id || user.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs">
                                                    {user.name?.charAt(0) || '?'}
                                                </div>
                                                <span className="font-medium">{user.name || 'Unnamed'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 text-gray-500">{user.department || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                                                className="px-2 py-1 rounded border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            >
                                                <option value="student">Student</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
