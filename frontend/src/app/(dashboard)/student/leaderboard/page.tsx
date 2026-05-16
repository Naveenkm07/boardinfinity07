'use client';

import React, { useEffect, useState } from 'react';
import { leaderboardService } from '@/services/leaderboard.service';
import { Card } from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

export default function LeaderboardPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        leaderboardService.getLeaderboard()
            .then(setStudents)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                    <span>🏆 Hall of Fame</span>
                </h1>
                <p className="text-gray-500">Top performers based on coding, interviews, and community contributions.</p>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 items-end pt-8 pb-4">
                {/* 2nd Place */}
                {students[1] && (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-200 overflow-hidden bg-white shadow-lg">
                                {students[1].profileImage ? <img src={students[1].profileImage} alt="" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gray-100">{students[1].name.charAt(0)}</div>}
                            </div>
                            <div className="absolute -bottom-2 -right-1 bg-gray-200 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">2</div>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm truncate max-w-[100px]">{students[1].name}</p>
                            <p className="text-indigo-600 font-bold text-xs">{students[1].points} pts</p>
                        </div>
                        <div className="w-full h-24 bg-gray-100 rounded-t-2xl shadow-inner" />
                    </div>
                )}

                {/* 1st Place */}
                {students[0] && (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl">👑</div>
                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-yellow-400 overflow-hidden bg-white shadow-xl shadow-yellow-100">
                                {students[0].profileImage ? <img src={students[0].profileImage} alt="" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-yellow-50">{students[0].name.charAt(0)}</div>}
                            </div>
                            <div className="absolute -bottom-2 -right-1 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-lg">1</div>
                        </div>
                        <div className="text-center">
                            <p className="font-extrabold text-gray-900 truncate max-w-[120px]">{students[0].name}</p>
                            <p className="text-indigo-600 font-extrabold">{students[0].points} pts</p>
                        </div>
                        <div className="w-full h-32 bg-yellow-400 rounded-t-2xl shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-10" />
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {students[2] && (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-amber-600 overflow-hidden bg-white shadow-lg">
                                {students[2].profileImage ? <img src={students[2].profileImage} alt="" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-amber-50">{students[2].name.charAt(0)}</div>}
                            </div>
                            <div className="absolute -bottom-2 -right-1 bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">3</div>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-sm truncate max-w-[100px]">{students[2].name}</p>
                            <p className="text-indigo-600 font-bold text-xs">{students[2].points} pts</p>
                        </div>
                        <div className="w-full h-20 bg-amber-600/10 rounded-t-2xl shadow-inner" />
                    </div>
                )}
            </div>

            {/* Rest of the List */}
            <Card className="overflow-hidden border-none shadow-xl">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rank</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {students.map((s, i) => (
                            <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-sm font-bold ${i < 3 ? 'text-indigo-600' : 'text-gray-400'}`}>#{i + 1}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-100">
                                            {s.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{s.name}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">@{s.username || 'user'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-medium text-gray-500 uppercase">{s.department || 'N/A'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className="text-sm font-black text-gray-900">{s.points}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
