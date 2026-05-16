import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const portfolioService = {
    async getPublicPortfolio(username: string) {
        const { data } = await axios.get(`${API_URL}/users/portfolio/${username}`);
        return data.data.user;
    },
};
