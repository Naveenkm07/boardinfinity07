'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { userService } from '@/services/user.service';
import { Card } from '@/components/ui/Card';
import { User } from '@/types';

export default function PublicPortfolioPage() {
    const { username } = useParams();
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (username) {
            userService.getPublicPortfolio(username as string)
                .then(res => {
                    if (res.success && res.data) setUserData(res.data.user);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [username]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
    );

    if (!userData) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">404</h1>
                <p className="text-gray-500 mt-2">Portfolio not found.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 pt-32 pb-48 text-white px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
                    <div className="w-40 h-40 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-6xl font-black shadow-2xl relative overflow-hidden">
                        {userData.name.charAt(0)}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent" />
                    </div>
                    <div className="text-center md:text-left space-y-4 flex-1">
                        <h1 className="text-5xl font-black tracking-tight">{userData.name}</h1>
                        <p className="text-xl text-indigo-100 font-medium">{userData.department || 'Future Software Engineer'}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                            {userData.socialLinks?.github && (
                                <a href={userData.socialLinks.github} target="_blank" className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all font-bold text-sm border border-white/10">GitHub</a>
                            )}
                            {userData.socialLinks?.linkedin && (
                                <a href={userData.socialLinks.linkedin} target="_blank" className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all font-bold text-sm border border-white/10">LinkedIn</a>
                            )}
                            {userData.socialLinks?.portfolio && (
                                <a href={userData.socialLinks.portfolio} target="_blank" className="px-6 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition-all font-bold text-sm shadow-lg">Website</a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-6 -mt-32 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        <Card className="p-8 space-y-6">
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Platform Rank</p>
                                <div className="text-4xl font-black text-primary-600">{userData.points?.toLocaleString() || 0} pts</div>
                            </div>
                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Achievements</h3>
                                <div className="flex flex-wrap gap-3">
                                    {(userData.badges || []).map((badge, i) => (
                                        <div key={i} title={badge.name} className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl shadow-sm border border-primary-100 hover:scale-110 transition-transform cursor-help">
                                            {badge.icon || '🏆'}
                                        </div>
                                    ))}
                                    {(!userData.badges || userData.badges.length === 0) && <p className="text-xs text-gray-400 italic">No badges earned yet.</p>}
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8">
                            <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Skills & Tech</h3>
                            <div className="flex flex-wrap gap-2">
                                {(userData.skills || []).map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">About Me</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {userData.summary || "This student hasn't added a summary yet. They are a dedicated learner focusing on technical growth and placement success."}
                            </p>
                        </Card>

                        {userData.experience && userData.experience.length > 0 && (
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Work Experience</h2>
                                <div className="space-y-10">
                                    {userData.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-8 border-l-2 border-gray-100">
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-600" />
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                            </div>
                                            <p className="text-primary-600 font-semibold text-sm mb-4">{exp.company}</p>
                                            <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {userData.githubRepos && userData.githubRepos.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 px-2">GitHub Highlights</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {userData.githubRepos.map((repo, i) => (
                                        <a key={i} href={repo.html_url} target="_blank" className="block group">
                                            <Card className="p-6 h-full hover:border-indigo-300 transition-all">
                                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{repo.name}</h3>
                                                <p className="text-xs text-gray-400 mt-1 mb-4 line-clamp-2">{repo.description || 'No description provided.'}</p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{repo.language || 'Code'}</span>
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                                        ⭐ {repo.stargazers_count}
                                                    </div>
                                                </div>
                                            </Card>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
