import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { otpRateLimiter } from '../middleware/rateLimiter.middleware';
import { sendOtpSchema, verifyOtpSchema } from '../validators/auth.validator';

const router = Router();

/**
 * Auth Routes
 *
 * POST /api/auth/send-otp    — Send OTP to email (rate limited)
 * POST /api/auth/verify-otp  — Verify OTP and get JWT
 * GET  /api/auth/me           — Get current user profile (protected)
 */

// Public routes (with OTP-specific rate limiting)
router.post('/send-otp', otpRateLimiter, validate(sendOtpSchema), AuthController.sendOtp);
router.post('/verify-otp', otpRateLimiter, validate(verifyOtpSchema), AuthController.verifyOtp);

// Protected routes
router.get('/me', authenticate, AuthController.getMe);

export default router;
