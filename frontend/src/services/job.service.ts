import api from './api';
import { Job, JobApplication } from '../types';

export const jobService = {
    /**
     * Get list of jobs.
     */
    async getJobs(params?: { page?: number; limit?: number; company?: string; location?: string; type?: string }) {
        const response = await api.get('/jobs', { params });
        return response.data.data;
    },

    /**
     * Get job details by ID.
     */
    async getJobById(id: string) {
        const response = await api.get(`/jobs/${id}`);
        return response.data.data;
    },

    /**
     * Apply for a job.
     */
    async applyForJob(jobId: string, resumeUrl: string) {
        const response = await api.post(`/jobs/${jobId}/apply`, { resumeUrl });
        return response.data.data;
    },

    /**
     * Get current student's applications.
     */
    async getMyApplications() {
        const response = await api.get('/jobs/applications/me');
        return response.data.data.applications;
    },

    /**
     * Create a new job (Admin only).
     */
    async createJob(jobData: Partial<Job>) {
        const response = await api.post('/jobs', jobData);
        return response.data.data;
    },

    /**
     * Update a job (Admin only).
     */
    async updateJob(id: string, jobData: Partial<Job>) {
        const response = await api.patch(`/jobs/${id}`, jobData);
        return response.data.data;
    },

    /**
     * Delete a job (Admin only).
     */
    async deleteJob(id: string) {
        const response = await api.delete(`/jobs/${id}`);
        return response.data.data;
    },

    /**
     * Get applications for a job (Admin only).
     */
    async getJobApplications(jobId: string) {
        const response = await api.get(`/jobs/${jobId}/applications`);
        return response.data.data.applications;
    },

    /**
     * Update application status (Admin only).
     */
    async updateApplicationStatus(applicationId: string, status: string) {
        const response = await api.patch(`/jobs/applications/${applicationId}/status`, { status });
        return response.data.data;
    },

    /**
     * Score an application using AI (Admin only).
     */
    async scoreApplication(applicationId: string) {
        const response = await api.post(`/jobs/applications/${applicationId}/score`);
        return response.data.data;
    },

    /**
     * Get recommended jobs for the student.
     */
    async getRecommendations() {
        const response = await api.get('/jobs/recommendations');
        return response.data.data.jobs;
    },
};
