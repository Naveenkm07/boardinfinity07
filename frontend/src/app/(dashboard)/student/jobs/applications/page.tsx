'use client';

import React, { useEffect, useState } from 'react';
import { jobService } from '../../../../../services/job.service';
import { JobApplication } from '../../../../../types';
import Link from 'next/link';

export default function StudentApplicationsPage() {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchApplications() {
            try {
                const data = await jobService.getMyApplications();
                setApplications(data);
            } catch (err) {
                console.error('Failed to fetch applications:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Applications</h1>
                <p className="text-gray-500 text-sm">Track the status of your job applications</p>
            </div>

            {applications.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {applications.map((app: any) => (
                        <div key={app.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl font-bold text-indigo-600">
                                    {app.jobId.company.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{app.jobId.title}</h2>
                                    <p className="text-sm text-gray-500">{app.jobId.company} • Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            app.status === 'applied' ? 'bg-blue-50 text-blue-700' :
                                            app.status === 'shortlisted' ? 'bg-yellow-50 text-yellow-700' :
                                            app.status === 'interview' ? 'bg-purple-50 text-purple-700' :
                                            app.status === 'offered' ? 'bg-green-50 text-green-700' :
                                            'bg-red-50 text-red-700'
                                        }`}>
                                            {app.status}
                                        </span>
                                        {app.aiScore !== undefined && (
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                app.aiScore >= 80 ? 'bg-green-100 text-green-700' :
                                                app.aiScore >= 50 ? 'bg-orange-100 text-orange-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                AI Match: {app.aiScore}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Link 
                                    href={`/student/jobs/${app.jobId.id || app.jobId}`}
                                    className="px-4 py-2 rounded-xl bg-gray-50 text-gray-700 text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                >
                                    View Job Details
                                </Link>
                                <a 
                                    href={app.resumeUrl} 
                                    target="_blank" 
                                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-all"
                                >
                                    View Submitted Resume
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-20 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-8 w-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium">No applications found</p>
                    <p className="text-sm mt-1">Start applying for jobs to see them here.</p>
                    <Link href="/student/jobs" className="mt-6 text-indigo-600 font-bold hover:underline">
                        Browse Job Openings →
                    </Link>
                </div>
            )}
        </div>
    );
}
