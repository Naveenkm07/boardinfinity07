import { z } from 'zod';

/**
 * Validation schemas for authentication endpoints.
 * Using Zod for compile-time type safety + runtime validation.
 */

/** POST /api/auth/send-otp */
export const sendOtpSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format')
            .toLowerCase()
            .trim(),
    }),
});

/** POST /api/auth/verify-otp */
export const verifyOtpSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email format')
            .toLowerCase()
            .trim(),
        otp: z
            .string({ required_error: 'OTP is required' })
            .length(6, 'OTP must be exactly 6 digits')
            .regex(/^\d{6}$/, 'OTP must contain only digits'),
    }),
});

/** Type inference for use in controllers */
export type SendOtpInput = z.infer<typeof sendOtpSchema>['body'];
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>['body'];
