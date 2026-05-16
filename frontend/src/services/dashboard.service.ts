import api from './api';
import { DashboardStats, DashboardUpcoming } from '../types';

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        const { data } = await api.get('/dashboard/stats');
        return data.data;
    },

    async getUpcoming(): Promise<DashboardUpcoming> {
        const { data } = await api.get('/dashboard/upcoming');
        return data.data;
    },
};
