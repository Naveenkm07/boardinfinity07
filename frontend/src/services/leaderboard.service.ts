import api from './api';

export const leaderboardService = {
    async getLeaderboard(limit = 10) {
        const { data } = await api.get(`/leaderboard`, { params: { limit } });
        return data.data.students;
    },
};
