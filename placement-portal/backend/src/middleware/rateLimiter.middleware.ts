import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * Global rate limiter — protects all endpoints.
 * Default: 100 requests per 15-minute window per IP.
 */
export const globalRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later',
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,  // Disable `X-RateLimit-*` headers
});

/**
 * Strict OTP rate limiter — prevents brute-force OTP requests.
 * Default: 5 requests per 15-minute window per IP.
 *
 * This is applied specifically to OTP-related endpoints
 * (/api/auth/send-otp, /api/auth/verify-otp).
 */
export const otpRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.OTP_RATE_LIMIT_MAX,
    message: {
        success: false,
        message: 'Too many OTP requests. Please wait before trying again.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
