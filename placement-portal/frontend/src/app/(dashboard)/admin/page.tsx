'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';

/**
 * Admin Dashboard — main landing page for admin users.
 */
export default function AdminDashboard() {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Students', value: '2,847', icon: '👥', color: 'from-blue-500 to-indigo-500' },
        { label: 'Active Drives', value: '15', icon: '🏢', color: 'from-green-500 to-teal-500' },
        { label: 'Companies', value: '42', icon: '🏛️', color: 'from-purple-500 to-violet-500' },
        { label: 'Placed Students', value: '1,203', icon: '🎓', color: 'from-amber-500 to-orange-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Admin Panel — <span className="gradient-text">{user?.name}</span>
                </h1>
                <p className="text-gray-500 mt-2">Manage placement drives, students, and company partnerships.</p>
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

            {/* Quick Actions & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'Create New Drive', icon: '➕', desc: 'Set up a new placement drive' },
                            { label: 'Add Company', icon: '🏢', desc: 'Register a new recruiting company' },
                            { label: 'Send Notifications', icon: '📢', desc: 'Broadcast to all students' },
                            { label: 'Export Reports', icon: '📊', desc: 'Download placement analytics' },
                        ].map((action, idx) => (
                            <button
                                key={idx}
                                className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-primary-50 transition-all duration-200 text-left group"
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                                <div>
                                    <p className="font-medium text-gray-800">{action.label}</p>
                                    <p className="text-xs text-gray-500">{action.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Registrations</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Rahul Sharma', dept: 'Computer Science', time: '10 min ago' },
                            { name: 'Priya Patel', dept: 'Electronics', time: '1 hour ago' },
                            { name: 'Amit Kumar', dept: 'Mechanical', time: '3 hours ago' },
                            { name: 'Sneha Reddy', dept: 'Information Technology', time: '5 hours ago' },
                        ].map((student, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">{student.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.dept}</p>
                                </div>
                                <span className="text-xs text-gray-400 whitespace-nowrap">{student.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
