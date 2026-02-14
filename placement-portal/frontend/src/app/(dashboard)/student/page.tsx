'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';

/**
 * Student Dashboard — main landing page for student users.
 */
export default function StudentDashboard() {
    const { user } = useAuth();

    const stats = [
        { label: 'Active Drives', value: '12', icon: '🏢', color: 'from-blue-500 to-cyan-500' },
        { label: 'Applications', value: '5', icon: '📋', color: 'from-green-500 to-emerald-500' },
        { label: 'Interviews', value: '2', icon: '🎯', color: 'from-purple-500 to-pink-500' },
        { label: 'Offers', value: '1', icon: '🎉', color: 'from-orange-500 to-amber-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, <span className="gradient-text">{user?.name}</span> 👋
                </h1>
                <p className="text-gray-500 mt-2">Here&apos;s what&apos;s happening with your placements.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-3xl font-bold mt-1 text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Activity */}
            <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[
                        { text: 'Applied to Google - Software Engineer Intern', time: '2 hours ago', icon: '📋' },
                        { text: 'Profile updated — added project details', time: '1 day ago', icon: '✏️' },
                        { text: 'New drive: Microsoft — Full Stack Developer', time: '2 days ago', icon: '🆕' },
                    ].map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <span className="text-xl">{activity.icon}</span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
