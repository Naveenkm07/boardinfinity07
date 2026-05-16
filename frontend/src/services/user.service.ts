import api from './api';
import { ApiResponse, User } from '@/types';

/**
 * User API service — profile management and admin operations.
 */
export const userService = {
    /**
     * Get the authenticated user's profile.
     */
    getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
        const { data } = await api.get<ApiResponse<{ user: User }>>('/users/profile');
        return data;
    },

    /**
     * Update the authenticated user's profile.
     */
    updateProfile: async (
        updates: Partial<
            Pick<
                User,
                | 'name'
                | 'username'
                | 'department'
                | 'rollNumber'
                | 'phone'
                | 'summary'
                | 'skills'
                | 'socialLinks'
                | 'experience'
                | 'education'
                | 'resumeUrl'
            >
        >,
    ): Promise<ApiResponse<{ user: User }>> => {
        const { data } = await api.patch<ApiResponse<{ user: User }>>('/users/profile', updates);
        return data;
    },

    /**
     * List all users (admin only).
     */
    listUsers: async (params: {
        page?: number;
        limit?: number;
        role?: string;
    }): Promise<
        ApiResponse<{
            users: User[];
            total: number;
            page: number;
            totalPages: number;
        }>
    > => {
        const { data } = await api.get('/users', { params });
        return data;
    },

    /**
     * Delete a user by ID (admin only).
     */
    deleteUser: async (userId: string): Promise<ApiResponse> => {
        const { data } = await api.delete<ApiResponse>(`/users/${userId}`);
        return data;
    },

    /**
     * Upload resume PDF and update profile.
     */
    uploadResume: async (file: File): Promise<ApiResponse<{ user: User; extractedSkills: string[]; resumeUrl: string }>> => {
        const formData = new FormData();
        formData.append('resume', file);
        const { data } = await api.post<ApiResponse<{ user: User; extractedSkills: string[]; resumeUrl: string }>>(
            '/users/resume',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data;
    },

    /**
     * Score resume against a job description.
     */
    scoreResume: async (jobDescription: string): Promise<ApiResponse<any>> => {
        const { data } = await api.post<ApiResponse<any>>('/users/score-resume', { jobDescription });
        return data;
    },

    /**
     * Sync top repositories from GitHub.
     */
    syncGithub: async (): Promise<ApiResponse<{ repos: any[] }>> => {
        const { data } = await api.post<ApiResponse<{ repos: any[] }>>('/users/sync-github');
        return data;
    },

    /**
     * Get students leaderboard.
     */
    getLeaderboard: async (): Promise<ApiResponse<{ leaderboard: any[] }>> => {
        const { data } = await api.get<ApiResponse<{ leaderboard: any[] }>>('/users/leaderboard');
        return data;
    },
};
