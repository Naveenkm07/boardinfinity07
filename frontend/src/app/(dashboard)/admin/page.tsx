'use client';

import React, { useState, useEffect } from 'react';
import { adminService } from '@/services/admin.service';
import { AdminAnalytics } from '@/types';
import { Card } from '@/components/ui/Card';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!analytics) return null;

    const stats = [
        { label: 'Total Students', value: analytics.totalStudents, icon: '👨‍🎓', color: 'bg-blue-50 text-blue-600' },
        { label: 'Active Jobs', value: analytics.totalJobs, icon: '💼', color: 'bg-green-50 text-green-600' },
        { label: 'Applications', value: analytics.totalApplications, icon: '📄', color: 'bg-purple-50 text-purple-600' },
        { label: 'Courses', value: analytics.totalCourses, icon: '📚', color: 'bg-orange-50 text-orange-600' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
                <p className="text-sm text-gray-500">Real-time platform metrics and analysis.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Application Trends */}
                <Card className="p-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Application Trends (Monthly)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.applicationStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Placement Distribution */}
                <Card className="p-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Placement Status Distribution</h3>
                    <div className="h-80 flex flex-col md:flex-row items-center">
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={analytics.placementStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {analytics.placementStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 mt-6 md:mt-0 md:pl-8">
                            {analytics.placementStats.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-xs font-medium text-gray-600">{item.name}:</span>
                                    <span className="text-xs font-bold text-gray-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 p-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Recent Signups</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {analytics.recentSignups.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 text-sm font-bold text-gray-900">{user.name}</td>
                                        <td className="py-4 text-sm text-gray-500">{user.email}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-gray-400">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full p-4 text-left rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg">📝</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Post a Job</p>
                                <p className="text-[10px] text-gray-500">Create a new opportunity</p>
                            </div>
                        </button>
                        <button className="w-full p-4 text-left rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-lg">🎓</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Add Course</p>
                                <p className="text-[10px] text-gray-500">Upload new learning content</p>
                            </div>
                        </button>
                        <button className="w-full p-4 text-left rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-lg">📢</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Broadcast</p>
                                <p className="text-[10px] text-gray-500">Send notification to all</p>
                            </div>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
