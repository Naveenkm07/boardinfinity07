'use client';

import React, { useEffect, useState } from 'react';
import { competitionService } from '../../../../services/competition.service';
import { Competition, CompetitionStatus, DifficultyLevel } from '../../../../types';

const STATUS_TABS: { label: string; value: CompetitionStatus | '' }[] = [
    { label: 'All', value: '' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Active', value: 'active' },
    { label: 'Ended', value: 'ended' },
];

const DIFFICULTY: { label: string; value: DifficultyLevel | '' }[] = [
    { label: 'All Levels', value: '' },
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
];

const diffColors: Record<string, string> = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
};

const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700',
    active: 'bg-green-100 text-green-700',
    ended: 'bg-gray-100 text-gray-600',
};

export default function CompetitionsPage() {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<CompetitionStatus | ''>('');
    const [difficulty, setDifficulty] = useState<DifficultyLevel | ''>('');

    useEffect(() => {
        fetchCompetitions();
    }, [status, difficulty]);

    async function fetchCompetitions() {
        setLoading(true);
        try {
            const data = await competitionService.listCompetitions(
                1, 20,
                (status || undefined) as CompetitionStatus | undefined,
                (difficulty || undefined) as string | undefined,
            );
            setCompetitions(data.competitions);
        } catch (err) {
            console.error('Failed to load competitions:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(id: string) {
        try {
            await competitionService.registerForCompetition(id);
            fetchCompetitions();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to register');
        }
    }

    function resetFilters() {
        setStatus('');
        setDifficulty('');
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Competitions</h1>
                <button onClick={resetFilters} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Reset Filters
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-6">
                <div className="flex gap-2">
                    {STATUS_TABS.map((t) => (
                        <button
                            key={t.value}
                            onClick={() => setStatus(t.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${status === t.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    {DIFFICULTY.map((d) => (
                        <button
                            key={d.value}
                            onClick={() => setDifficulty(d.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${difficulty === d.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
            ) : competitions.length === 0 ? (
                <p className="text-center py-20 text-gray-400">No competitions found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {competitions.map((comp: any) => (
                        <div key={comp._id || comp.id} className="rounded-xl bg-white border border-gray-100 shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[comp.status]}`}>
                                        {comp.status}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffColors[comp.difficulty]}`}>
                                        {comp.difficulty}
                                    </span>
                                </div>
                                {comp.prize && <span className="text-sm">🏆 {comp.prize}</span>}
                            </div>
                            <h3 className="font-semibold text-xl">{comp.title}</h3>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{comp.description}</p>
                            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-500">
                                <span>📅 Start: {new Date(comp.startDate).toLocaleDateString()}</span>
                                <span>📅 End: {new Date(comp.endDate).toLocaleDateString()}</span>
                                <span>👥 {comp.participants?.length || 0} / {comp.maxParticipants}</span>
                            </div>
                            {comp.status !== 'ended' && (
                                <button
                                    onClick={() => handleRegister(comp._id || comp.id)}
                                    className="mt-4 w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition text-sm"
                                >
                                    Register Now
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
