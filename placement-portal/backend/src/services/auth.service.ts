import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { OtpService } from './otp.service';
import { sendOtpEmail } from './email.service';
import { env } from '../config/env';
import { JwtPayload, UserRole } from '../types';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

/**
 * Authentication Service — orchestrates the login flow.
 *
 * Flow:
 * 1. User submits email → sendOtp()
 *    - Generate OTP, hash & store it, email plaintext to user
 * 2. User submits email + OTP → verifyOtpAndLogin()
 *    - Verify OTP, upsert user, generate JWT, return token + user
 */
export class AuthService {
    /**
     * Step 1: Send OTP to the provided email.
     */
    static async sendOtp(email: string): Promise<void> {
        // Generate and store OTP
        const otp = await OtpService.generateOtp(email);

        // Send OTP via email
        await sendOtpEmail(email, otp);

        logger.info(`OTP sent to ${email}`);
    }

    /**
     * Step 2: Verify OTP and complete login.
     *
     * If the user doesn't exist, create a new account (first-time login).
     * Returns a signed JWT and the user object.
     */
    static async verifyOtpAndLogin(
        email: string,
        otp: string,
    ): Promise<{ token: string; user: Record<string, unknown> }> {
        // Verify OTP (throws if invalid)
        await OtpService.verifyOtp(email, otp);

        // Upsert user — find existing or create new
        let user = await User.findOne({ email });

        if (!user) {
            // First-time login — create user with default role
            user = await User.create({
                email,
                name: email.split('@')[0], // Temporary name from email prefix
                role: UserRole.STUDENT,
                isVerified: true,
            });
            logger.info(`New user created: ${email}`);
        } else {
            // Mark as verified if not already
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        }

        // Generate JWT
        const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role as UserRole,
        };

        const token = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
        });

        logger.info(`User logged in: ${email}`);

        return {
            token,
            user: user.toJSON(),
        };
    }

    /**
     * Get the current user's profile from a JWT payload.
     */
    static async getCurrentUser(userId: string) {
        const user = await User.findById(userId);

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user.toJSON();
    }
}
