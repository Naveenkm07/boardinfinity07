import api from './api';
import { ApiResponse, LoginResponse } from '@/types';

/**
 * Auth API service — all authentication-related API calls.
 */
export const authService = {
    /**
     * Request an OTP for the given email.
     */
    sendOtp: async (email: string): Promise<ApiResponse> => {
        const { data } = await api.post<ApiResponse>('/auth/send-otp', { email });
        return data;
    },

    /**
     * Verify OTP and get JWT token + user data.
     */
    verifyOtp: async (email: string, otp: string): Promise<ApiResponse<LoginResponse>> => {
        const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/verify-otp', {
            email,
            otp,
        });
        return data;
    },

    /**
     * Get the current authenticated user's profile.
     */
    getMe: async (): Promise<ApiResponse<{ user: LoginResponse['user'] }>> => {
        const { data } = await api.get<ApiResponse<{ user: LoginResponse['user'] }>>('/auth/me');
        return data;
    },
};
