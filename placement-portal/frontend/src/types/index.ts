/**
 * Shared TypeScript types for the frontend.
 * These mirror the backend types to ensure type safety across the stack.
 */

/** User roles */
export enum UserRole {
    STUDENT = 'student',
    ADMIN = 'admin',
}

/** User object returned from the API */
export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isVerified: boolean;
    department?: string;
    rollNumber?: string;
    phone?: string;
    profileImage?: string;
    createdAt: string;
    updatedAt: string;
}

/** JWT payload decoded from the token */
export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat: number;
    exp: number;
}

/** Standardized API response shape */
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}

/** Auth API response types */
export interface LoginResponse {
    token: string;
    user: User;
}

/** Auth context state */
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
