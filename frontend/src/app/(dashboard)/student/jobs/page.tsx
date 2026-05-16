'use client';

import React, { useEffect, useState } from 'react';
import { jobService } from '../../../../services/job.service';
import { Job } from '../../../../types';
import Link from 'next/link';

export default function StudentJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchJobs() {
            try {
                const data = await jobService.getJobs();
                setJobs(data.jobs);
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Job Openings</h1>
                    <p className="text-gray-500 text-sm">Find your next career opportunity</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search jobs, companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl font-bold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {job.company.charAt(0)}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    job.type === 'full-time' ? 'bg-green-100 text-green-700' :
                                    job.type === 'internship' ? 'bg-blue-100 text-blue-700' :
                                    'bg-orange-100 text-orange-700'
                                }`}>
                                    {job.type}
                                </span>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{job.title}</h2>
                            <p className="text-sm font-medium text-gray-600 mb-4">{job.company}</p>
                            
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center text-sm text-gray-500">
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {job.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                                </div>
                            </div>

                            <Link 
                                href={`/student/jobs/${job.id}`}
                                className="block w-full text-center py-2.5 rounded-xl bg-gray-50 text-gray-700 font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                            >
                                View Details
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                        <svg className="h-16 w-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p>No job openings found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
