import api from './api';
import { AdminAnalytics, User } from '../types';

export const adminService = {
    async getAnalytics(): Promise<AdminAnalytics> {
        const { data } = await api.get('/admin/analytics');
        return data.data;
    },

    async listUsers(page = 1, limit = 20, role?: string) {
        const params: Record<string, string | number> = { page, limit };
        if (role) params.role = role;
        const { data } = await api.get('/admin/users', { params });
        return data.data as { users: User[]; total: number; page: number; totalPages: number };
    },

    async updateUserRole(userId: string, role: string) {
        const { data } = await api.patch(`/admin/users/${userId}`, { role });
        return data.data.user as User;
    },

    async getAssessmentResults(assessmentId: string) {
        const { data } = await api.get(`/admin/assessments/${assessmentId}/results`);
        return data.data.results;
    },
};
