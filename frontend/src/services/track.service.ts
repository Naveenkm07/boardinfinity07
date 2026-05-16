import api from './api';

export const trackService = {
    async listTracks() {
        const response = await api.get('/tracks');
        return response.data.data.tracks;
    },

    async getTrackById(id: string) {
        const response = await api.get(`/tracks/${id}`);
        return response.data.data;
    },

    async createTrack(data: any) {
        const response = await api.post('/tracks', data);
        return response.data.data;
    },

    async updateTrack(id: string, data: any) {
        const response = await api.patch(`/tracks/${id}`, data);
        return response.data.data;
    },

    async deleteTrack(id: string) {
        const response = await api.delete(`/tracks/${id}`);
        return response.data.data;
    },
};
