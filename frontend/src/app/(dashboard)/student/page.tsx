'use client';

import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../../services/dashboard.service';
import { DashboardStats, DashboardUpcoming } from '../../../types';

export default function StudentDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [upcoming, setUpcoming] = useState<DashboardUpcoming | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsData, upcomingData] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getUpcoming(),
                ]);
                setStats(statsData);
                setUpcoming(upcomingData);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
                    <p className="mt-2 text-indigo-100">Track your progress, upcoming sessions, and assessments all in one place.</p>
                </div>
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Enrolled Courses', value: stats?.enrolledCourses ?? 0, icon: '📚', color: 'from-blue-500 to-blue-600' },
                    { label: 'Completed Courses', value: stats?.completedCourses ?? 0, icon: '✅', color: 'from-green-500 to-green-600' },
                    { label: 'Upcoming Sessions', value: stats?.upcomingSessions ?? 0, icon: '📅', color: 'from-orange-500 to-orange-600' },
                    { label: 'Pending Assessments', value: stats?.pendingAssessments ?? 0, icon: '📝', color: 'from-red-500 to-red-600' },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Course Progress */}
                <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">📚 Continue Learning</h2>
                    {upcoming?.courseProgress && upcoming.courseProgress.length > 0 ? (
                        <div className="space-y-4">
                            {upcoming.courseProgress.map((cp: any) => (
                                <div key={cp._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{cp.courseId?.title || 'Course'}</p>
                                        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                                                style={{ width: `${cp.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-indigo-600">{cp.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No courses in progress. Enroll in a course to get started!</p>
                    )}
                </div>

                {/* Upcoming Sessions */}
                <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">📅 Upcoming Sessions</h2>
                    {upcoming?.sessions && upcoming.sessions.length > 0 ? (
                        <div className="space-y-3">
                            {upcoming.sessions.map((session: any) => (
                                <div key={session._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 text-sm font-bold">
                                        {new Date(session.scheduledAt).getDate()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{session.title}</p>
                                        <p className="text-xs text-gray-400">{session.host} • {session.duration} min</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No upcoming sessions at the moment.</p>
                    )}
                </div>
            </div>

            {/* Upcoming Assessments */}
            <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">📝 Pending Assessments</h2>
                {upcoming?.assessments && upcoming.assessments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcoming.assessments.map((assessment: any) => (
                            <div key={assessment._id} className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition">
                                <h3 className="font-medium">{assessment.title}</h3>
                                <p className="text-xs text-gray-400 mt-1">{assessment.questions?.length || 0} questions • {assessment.duration} min</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-xs text-red-500">Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">Pending</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">All caught up! No pending assessments.</p>
                )}
            </div>
        </div>
    );
}
