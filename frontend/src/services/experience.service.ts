import api from './api';

export const experienceService = {
    async getExperiences(params?: { page?: number; limit?: number; company?: string; tag?: string }) {
        const response = await api.get('/experiences', { params });
        return response.data.data;
    },

    async getExperienceById(id: string) {
        const response = await api.get(`/experiences/${id}`);
        return response.data.data;
    },

    async createExperience(data: { title: string; company: string; role: string; content: string; tags: string[] }) {
        const response = await api.post('/experiences', data);
        return response.data.data;
    },

    async updateExperience(id: string, data: any) {
        const response = await api.patch(`/experiences/${id}`, data);
        return response.data.data;
    },

    async deleteExperience(id: string) {
        const response = await api.delete(`/experiences/${id}`);
        return response.data.data;
    },

    async upvoteExperience(id: string) {
        const response = await api.post(`/experiences/${id}/upvote`);
        return response.data.data;
    },

    async addComment(id: string, content: string) {
        const response = await api.post(`/experiences/${id}/comment`, { content });
        return response.data.data;
    },
};
