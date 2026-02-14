import { Request } from 'express';

/**
 * User roles available in the system.
 */
export enum UserRole {
    STUDENT = 'student',
    ADMIN = 'admin',
}

/**
 * Decoded JWT payload attached to authenticated requests.
 */
export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

/**
 * Extended Express Request with authenticated user info.
 */
export interface AuthRequest extends Request {
    user?: JwtPayload;
}

/**
 * User document interface (matches Mongoose schema).
 */
export interface IUser {
    _id: string;
    email: string;
    name: string;
    role: UserRole;
    isVerified: boolean;
    department?: string;
    rollNumber?: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * OTP document interface (matches Mongoose schema).
 */
export interface IOtp {
    _id: string;
    email: string;
    otp: string; // bcrypt-hashed
    attempts: number;
    expiresAt: Date;
    createdAt: Date;
}

/**
 * Standardized API response shape.
 */
export interface ApiResponseType<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}
