import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Otp } from '../models/otp.model';
import { CONSTANTS } from '../utils/constants';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

/**
 * OTP Service — handles generation, hashing, storage, and verification.
 *
 * Security measures:
 * 1. OTP is generated using crypto.randomInt (cryptographically secure)
 * 2. Stored as bcrypt hash — never in plaintext
 * 3. Max 5 verification attempts before lockout
 * 4. MongoDB TTL index auto-deletes expired OTPs
 * 5. Previous OTPs for the same email are deleted before creating new ones
 */
export class OtpService {
    /**
     * Generate a new OTP for the given email.
     * Deletes any existing OTP for that email first.
     *
     * @returns The plaintext OTP (for sending via email)
     */
    static async generateOtp(email: string): Promise<string> {
        // Delete any existing OTP for this email
        await Otp.deleteMany({ email });

        // Generate cryptographically secure 6-digit OTP
        const otpPlain = crypto
            .randomInt(0, Math.pow(10, CONSTANTS.OTP_LENGTH))
            .toString()
            .padStart(CONSTANTS.OTP_LENGTH, '0');

        // Hash OTP with bcrypt (cost factor 10)
        const otpHash = await bcrypt.hash(otpPlain, 10);

        // Calculate expiry time
        const expiresAt = new Date(Date.now() + CONSTANTS.OTP_EXPIRY_MINUTES * 60 * 1000);

        // Store hashed OTP
        await Otp.create({
            email,
            otp: otpHash,
            attempts: 0,
            expiresAt,
        });

        logger.info(`OTP generated for ${email}`);
        return otpPlain;
    }

    /**
     * Verify an OTP for the given email.
     *
     * @returns true if OTP is valid
     * @throws ApiError if OTP is invalid, expired, or max attempts exceeded
     */
    static async verifyOtp(email: string, otpPlain: string): Promise<boolean> {
        const otpRecord = await Otp.findOne({ email });

        if (!otpRecord) {
            throw ApiError.badRequest('OTP not found or has expired. Please request a new one.');
        }

        // Check brute-force attempts
        if (otpRecord.attempts >= CONSTANTS.OTP_MAX_ATTEMPTS) {
            // Delete the OTP record to force requesting a new one
            await Otp.deleteOne({ _id: otpRecord._id });
            throw ApiError.tooManyRequests(
                'Maximum verification attempts exceeded. Please request a new OTP.',
            );
        }

        // Compare plaintext OTP with stored hash
        const isValid = await bcrypt.compare(otpPlain, otpRecord.otp);

        if (!isValid) {
            // Increment attempt counter
            await Otp.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });

            const remaining = CONSTANTS.OTP_MAX_ATTEMPTS - otpRecord.attempts - 1;
            throw ApiError.badRequest(
                `Invalid OTP. ${remaining} attempt(s) remaining.`,
            );
        }

        // OTP is valid — delete it (single-use)
        await Otp.deleteOne({ _id: otpRecord._id });

        logger.info(`OTP verified successfully for ${email}`);
        return true;
    }
}
