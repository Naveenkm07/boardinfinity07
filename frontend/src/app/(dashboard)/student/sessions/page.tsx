'use client';

import React, { useEffect, useState } from 'react';
import { sessionService } from '../../../../services/session.service';
import { Session, SessionStatus } from '../../../../types';

const TABS: { label: string; value: SessionStatus | '' }[] = [
    { label: 'All', value: '' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];

export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<SessionStatus | ''>('');

    useEffect(() => {
        fetchSessions();
    }, [tab]);

    async function fetchSessions() {
        setLoading(true);
        try {
            const data = await sessionService.listSessions(1, 20, (tab || undefined) as SessionStatus | undefined);
            setSessions(data.sessions);
        } catch (err) {
            console.error('Failed to load sessions:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleAttend(id: string) {
        try {
            await sessionService.attendSession(id);
            fetchSessions();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to register');
        }
    }

    const statusColors: Record<string, string> = {
        upcoming: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Live Sessions</h1>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-1">
                {TABS.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setTab(t.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${tab === t.value
                                ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
            ) : sessions.length === 0 ? (
                <p className="text-center py-20 text-gray-400">No sessions found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions.map((session: any) => (
                        <div key={session._id || session.id} className="rounded-xl bg-white border border-gray-100 shadow-md p-5 hover:shadow-lg transition">
                            <div className="flex items-start justify-between mb-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[session.status] || ''}`}>
                                    {session.status}
                                </span>
                                <span className="text-xs text-gray-400">{session.duration} min</span>
                            </div>
                            <h3 className="font-semibold text-lg">{session.title}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{session.description}</p>
                            <div className="mt-4 text-sm text-gray-500">
                                <p>👨‍🏫 {session.host}</p>
                                <p>📅 {new Date(session.scheduledAt).toLocaleString()}</p>
                                <p>👥 {session.attendees?.length || 0} / {session.maxAttendees} registered</p>
                            </div>
                            {session.status === 'upcoming' && (
                                <button
                                    onClick={() => handleAttend(session._id || session.id)}
                                    className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition text-sm"
                                >
                                    Register
                                </button>
                            )}
                            {session.status === 'upcoming' && session.meetingLink && (
                                <a
                                    href={session.meetingLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 block w-full text-center py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition text-sm"
                                >
                                    Join Session ↗
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
