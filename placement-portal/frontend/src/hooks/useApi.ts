'use client';

import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/types';

/**
 * Custom hook for API calls with loading and error state management.
 *
 * Usage:
 *   const { execute, isLoading, error } = useApi();
 *   const data = await execute(() => authService.sendOtp(email));
 */
export function useApi<T = unknown>() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>): Promise<ApiResponse<T> | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await apiCall();
            return result;
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            const message = axiosError.response?.data?.message || 'Something went wrong. Please try again.';
            setError(message);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { execute, isLoading, error, clearError };
}
