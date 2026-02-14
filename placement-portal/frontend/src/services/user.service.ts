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
        updates: Partial<Pick<User, 'name' | 'department' | 'rollNumber' | 'phone'>>,
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
};
