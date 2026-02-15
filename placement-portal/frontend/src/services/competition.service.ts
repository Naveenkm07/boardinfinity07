import api from './api';
import { Competition, CompetitionStatus } from '../types';

export const competitionService = {
    async listCompetitions(page = 1, limit = 10, status?: CompetitionStatus, difficulty?: string) {
        const params: Record<string, string | number> = { page, limit };
        if (status) params.status = status;
        if (difficulty) params.difficulty = difficulty;
        const { data } = await api.get('/competitions', { params });
        return data.data as { competitions: Competition[]; total: number; page: number; totalPages: number };
    },

    async getCompetitionById(id: string) {
        const { data } = await api.get(`/competitions/${id}`);
        return data.data.competition as Competition;
    },

    async createCompetition(compData: Partial<Competition>) {
        const { data } = await api.post('/competitions', compData);
        return data.data.competition as Competition;
    },

    async updateCompetition(id: string, compData: Partial<Competition>) {
        const { data } = await api.put(`/competitions/${id}`, compData);
        return data.data.competition as Competition;
    },

    async deleteCompetition(id: string) {
        await api.delete(`/competitions/${id}`);
    },

    async registerForCompetition(id: string) {
        const { data } = await api.post(`/competitions/${id}/register`);
        return data.data.competition as Competition;
    },
};
