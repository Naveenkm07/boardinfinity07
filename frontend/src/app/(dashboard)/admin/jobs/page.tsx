'use client';

import React, { useEffect, useState } from 'react';
import { jobService } from '../../../../services/job.service';
import { Job, JobApplication } from '../../../../types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [viewingApplications, setViewingApplications] = useState<string | null>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

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

    async function handleViewApplications(jobId: string) {
        setViewingApplications(jobId);
        try {
            const data = await jobService.getJobApplications(jobId);
            setApplications(data);
        } catch (err) {
            console.error('Failed to fetch applications:', err);
        }
    }

    async function handleUpdateStatus(applicationId: string, status: string) {
        try {
            await jobService.updateApplicationStatus(applicationId, status);
            // Refresh applications
            if (viewingApplications) handleViewApplications(viewingApplications);
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    }

    async function handleScoreApplication(applicationId: string) {
        try {
            await jobService.scoreApplication(applicationId);
            // Refresh applications
            if (viewingApplications) handleViewApplications(viewingApplications);
            alert('AI Scoring completed successfully!');
        } catch (err) {
            console.error('Failed to score application:', err);
            alert('AI Scoring failed');
        }
    }

    async function handleDeleteJob(id: string) {
        if (!confirm('Are you sure you want to delete this job?')) return;
        try {
            await jobService.deleteJob(id);
            fetchJobs();
        } catch (err) {
            console.error('Failed to delete job:', err);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Job Postings</h1>
                    <p className="text-gray-500 text-sm">Create and monitor job applications</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    + Post New Job
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {jobs.map((job) => (
                    <Card key={job.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold uppercase">{job.type}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-600">{job.company} • {job.location}</p>
                                <p className="text-xs text-gray-400 mt-1">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="outline" 
                                    onClick={() => handleViewApplications(job.id)}
                                    className={viewingApplications === job.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}
                                >
                                    View Applications
                                </Button>
                                <Button variant="secondary" onClick={() => { setSelectedJob(job); setIsModalOpen(true); }}>
                                    Edit
                                </Button>
                                <button 
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {viewingApplications === job.id && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Applications</h3>
                                {applications.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="text-gray-400 font-medium border-b border-gray-50">
                                                    <th className="pb-3 pr-4">Student</th>
                                                    <th className="pb-3 px-4">Details</th>
                                                    <th className="pb-3 px-4">Status</th>
                                                    <th className="pb-3 pl-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {applications.map((app: any) => (
                                                    <tr key={app.id}>
                                                        <td className="py-4 pr-4">
                                                            <div className="font-bold text-gray-900">{app.studentId.name}</div>
                                                            <div className="text-xs text-gray-500">{app.studentId.email}</div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="text-xs text-gray-600">{app.studentId.department} • {app.studentId.rollNumber}</div>
                                                            <div className="flex items-center gap-4 mt-1">
                                                                <a href={app.resumeUrl} target="_blank" className="text-indigo-600 hover:underline text-xs inline-block">View Resume</a>
                                                                {app.aiScore !== undefined && (
                                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                                        app.aiScore >= 80 ? 'bg-green-100 text-green-700' :
                                                                        app.aiScore >= 50 ? 'bg-orange-100 text-orange-700' :
                                                                        'bg-red-100 text-red-700'
                                                                    }`}>
                                                                        AI: {app.aiScore}%
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                                app.status === 'applied' ? 'bg-blue-50 text-blue-700' :
                                                                app.status === 'shortlisted' ? 'bg-yellow-50 text-yellow-700' :
                                                                app.status === 'interview' ? 'bg-purple-50 text-purple-700' :
                                                                app.status === 'offered' ? 'bg-green-50 text-green-700' :
                                                                'bg-red-50 text-red-700'
                                                            }`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 pl-4">
                                                            <div className="flex items-center gap-2">
                                                                <select 
                                                                    value={app.status}
                                                                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                                                    className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                                >
                                                                    <option value="applied">Applied</option>
                                                                    <option value="shortlisted">Shortlisted</option>
                                                                    <option value="interview">Interview</option>
                                                                    <option value="offered">Offered</option>
                                                                    <option value="rejected">Rejected</option>
                                                                </select>
                                                                <button 
                                                                    onClick={() => handleScoreApplication(app.id)}
                                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                                                                    title="Run AI Scoring"
                                                                >
                                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No applications received yet.</p>
                                )}
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Mock Modal for Job Creation/Editing */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">{selectedJob ? 'Edit Job' : 'Post New Job'}</h2>
                            <button onClick={() => { setIsModalOpen(false); setSelectedJob(null); }} className="text-gray-400 hover:text-gray-600">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form className="space-y-4" onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const jobData = {
                                title: formData.get('title') as string,
                                company: formData.get('company') as string,
                                location: formData.get('location') as string,
                                type: formData.get('type') as any,
                                deadline: formData.get('deadline') as string,
                                description: formData.get('description') as string,
                                requirements: (formData.get('requirements') as string).split('\n').filter(r => r.trim()),
                                skills: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(s => s),
                            };
                            
                            try {
                                if (selectedJob) {
                                    await jobService.updateJob(selectedJob.id, jobData);
                                } else {
                                    await jobService.createJob(jobData);
                                }
                                setIsModalOpen(false);
                                setSelectedJob(null);
                                fetchJobs();
                            } catch (err) {
                                console.error('Failed to save job:', err);
                            }
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Job Title</label>
                                    <input name="title" defaultValue={selectedJob?.title} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Company</label>
                                    <input name="company" defaultValue={selectedJob?.company} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                                    <input name="location" defaultValue={selectedJob?.location} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                                    <select name="type" defaultValue={selectedJob?.type || 'full-time'} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                                        <option value="full-time">Full-time</option>
                                        <option value="internship">Internship</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Deadline</label>
                                    <input name="deadline" type="date" defaultValue={selectedJob?.deadline ? new Date(selectedJob.deadline).toISOString().split('T')[0] : ''} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Skills (comma separated)</label>
                                    <input name="skills" defaultValue={selectedJob?.skills?.join(', ')} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                <textarea name="description" defaultValue={selectedJob?.description} rows={4} required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Requirements (one per line)</label>
                                <textarea name="requirements" defaultValue={selectedJob?.requirements?.join('\n')} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" className="flex-1">
                                    {selectedJob ? 'Update Job' : 'Create Job'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setSelectedJob(null); }} className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
