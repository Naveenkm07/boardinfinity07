'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobService } from '../../../../../services/job.service';
import { userService } from '../../../../../services/user.service';
import { Job, JobApplication } from '../../../../../types';
import { useAuth } from '../../../../../hooks/useAuth';
import Link from 'next/link';

export default function JobDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    
    // AI Score State
    const [scoring, setScoring] = useState(false);
    const [aiScore, setAiScore] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [jobData, applications] = await Promise.all([
                    jobService.getJobById(id as string),
                    jobService.getMyApplications(),
                ]);
                setJob(jobData);
                setApplied(applications.some((app: JobApplication) => 
                    (typeof app.jobId === 'string' ? app.jobId : app.jobId.id) === id
                ));
            } catch (err) {
                console.error('Failed to fetch job details:', err);
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchData();
    }, [id]);

    async function handleApply() {
        if (!user?.resumeUrl) {
            alert('Please upload your resume in your profile before applying.');
            router.push('/profile');
            return;
        }

        setApplying(true);
        try {
            await jobService.applyForJob(id as string, user.resumeUrl);
            setApplied(true);
            alert('Application submitted successfully!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to apply for job');
        } finally {
            setApplying(false);
        }
    }

    async function handleAIScore() {
        if (!user?.resumeUrl) {
            alert('Please upload your resume first.');
            return;
        }
        if (!job) return;

        setScoring(true);
        try {
            const response = await userService.scoreResume(job.description + '\n' + (job.requirements?.join('\n') || ''));
            setAiScore(response.data);
        } catch (err: any) {
            alert(err.response?.data?.message || 'AI Scoring failed');
        } finally {
            setScoring(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-gray-900">Job not found</h2>
                <button onClick={() => router.back()} className="mt-4 text-indigo-600 font-medium">Go Back</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <button 
                onClick={() => router.back()}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Jobs
            </button>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
                    <div className="flex gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl font-bold text-indigo-600 shrink-0">
                            {job.company.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                            <p className="text-lg text-gray-600">{job.company}</p>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    {job.location}
                                </span>
                                <span className="flex items-center text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">
                                    {job.type}
                                </span>
                                {job.salary && (
                                    <span className="flex items-center">
                                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {job.salary}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0">
                        {applied ? (
                            <button disabled className="w-full md:w-auto px-8 py-3 rounded-xl bg-green-100 text-green-700 font-bold cursor-not-allowed">
                                ✓ Applied
                            </button>
                        ) : (
                            <button 
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full md:w-auto px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50"
                            >
                                {applying ? 'Applying...' : 'Apply Now'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
                            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </div>

                        {job.requirements && job.requirements.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements</h3>
                                <ul className="space-y-3">
                                    {job.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start text-gray-600">
                                            <span className="h-5 w-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mr-3 mt-0.5 text-xs font-bold">•</span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* AI Score Result Section */}
                        {aiScore && (
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <span className="text-xl">🤖</span> AI Resume Analysis
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-500 uppercase">Match Score</span>
                                        <div className={`text-2xl font-black ${
                                            aiScore.score >= 80 ? 'text-green-600' :
                                            aiScore.score >= 50 ? 'text-orange-600' :
                                            'text-red-600'
                                        }`}>
                                            {aiScore.score}%
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-sm text-gray-700 italic bg-white/50 p-4 rounded-xl border border-white">
                                    "{aiScore.matchReason}"
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Top Strengths</h4>
                                        <ul className="space-y-2">
                                            {aiScore.strengths?.map((s: string, i: number) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                    <span className="text-green-500 text-xs">✔</span> {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider">Missing Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {aiScore.missingSkills?.map((s: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded uppercase">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-indigo-100">
                                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Improvement Suggestions</h4>
                                    <ul className="space-y-2">
                                        {aiScore.suggestions?.map((s: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="text-indigo-400 mt-1">💡</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        {/* AI Match Button */}
                        <div className="p-6 bg-gray-900 rounded-2xl text-white shadow-xl shadow-gray-200">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <span className="text-xl">✨</span> Smart Match
                            </h3>
                            <p className="text-gray-400 text-xs mb-6">Compare your resume against this job using AI.</p>
                            <button 
                                onClick={handleAIScore}
                                disabled={scoring || !user?.resumeUrl}
                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold transition-all disabled:opacity-50"
                            >
                                {scoring ? 'Analyzing...' : 'Scan Resume'}
                            </button>
                            {!user?.resumeUrl && (
                                <p className="text-[10px] text-red-400 mt-2 text-center">Upload resume in profile first</p>
                            )}
                        </div>

                        {job.skills && job.skills.length > 0 && (
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Key Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white rounded-lg text-sm text-gray-600 border border-gray-200 shadow-sm">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="p-6 bg-indigo-600 rounded-2xl text-white">
                            <h3 className="text-lg font-bold mb-2">Ready to apply?</h3>
                            <p className="text-indigo-100 text-sm mb-6">Make sure your resume is up to date in your profile.</p>
                            <Link 
                                href="/profile" 
                                className="block w-full text-center py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-all"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
