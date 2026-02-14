import axios from 'axios';

/**
 * Axios instance pre-configured with the backend API base URL.
 *
 * Features:
 * 1. Auto-attaches JWT token from localStorage to every request
 * 2. Intercepts 401 responses to trigger auto-logout
 * 3. Configurable timeout for all requests
 */
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    timeout: 15000, // 15 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor ─────────────────────────────────────
// Attach JWT token to every outgoing request
api.interceptors.request.use(
    (config) => {
        // Only access localStorage on the client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// ─── Response Interceptor ────────────────────────────────────
// Handle 401 (Unauthorized) responses globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid — clear auth state
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');

                // Redirect to login if not already there
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    },
);

export default api;
