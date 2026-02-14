import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';

/**
 * Authentication Controller.
 * Thin layer — delegates business logic to AuthService.
 */
export class AuthController {
    /**
     * POST /api/auth/send-otp
     * Send a one-time password to the user's email.
     */
    static async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;

            await AuthService.sendOtp(email);

            ApiResponse.success(res, null, 'OTP sent successfully. Please check your email.');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/auth/verify-otp
     * Verify the OTP and return a JWT token.
     */
    static async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp } = req.body;

            const result = await AuthService.verifyOtpAndLogin(email, otp);

            ApiResponse.success(res, result, 'Login successful');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/auth/me
     * Get the currently authenticated user's profile.
     * Requires: authenticate middleware
     */
    static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await AuthService.getCurrentUser(req.user!.userId);

            ApiResponse.success(res, { user }, 'Profile retrieved');
        } catch (error) {
            next(error);
        }
    }
}
