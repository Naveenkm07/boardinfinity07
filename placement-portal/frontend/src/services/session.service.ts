import api from './api';
import { Session, SessionStatus } from '../types';

export const sessionService = {
    async listSessions(page = 1, limit = 10, status?: SessionStatus) {
        const params: Record<string, string | number> = { page, limit };
        if (status) params.status = status;
        const { data } = await api.get('/sessions', { params });
        return data.data as { sessions: Session[]; total: number; page: number; totalPages: number };
    },

    async getSessionById(id: string) {
        const { data } = await api.get(`/sessions/${id}`);
        return data.data.session as Session;
    },

    async createSession(sessionData: Partial<Session>) {
        const { data } = await api.post('/sessions', sessionData);
        return data.data.session as Session;
    },

    async updateSession(id: string, sessionData: Partial<Session>) {
        const { data } = await api.put(`/sessions/${id}`, sessionData);
        return data.data.session as Session;
    },

    async deleteSession(id: string) {
        await api.delete(`/sessions/${id}`);
    },

    async attendSession(id: string) {
        const { data } = await api.post(`/sessions/${id}/attend`);
        return data.data.session as Session;
    },
};
