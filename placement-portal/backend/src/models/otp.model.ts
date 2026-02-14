import mongoose, { Document, Schema } from 'mongoose';

/**
 * OTP document interface for Mongoose.
 */
export interface IOtpDocument extends Document {
    email: string;
    otp: string; // bcrypt-hashed — NEVER stored in plaintext
    attempts: number;
    expiresAt: Date;
    createdAt: Date;
}

/**
 * OTP schema — temporary records that auto-delete via TTL index.
 *
 * Security design:
 * 1. OTP is bcrypt-hashed before storage (same as passwords)
 * 2. `attempts` field tracks failed verifications — max 5 before lockout
 * 3. TTL index on `expiresAt` ensures MongoDB auto-deletes expired OTPs
 * 4. Each new OTP request deletes any existing OTP for that email
 */
const otpSchema = new Schema<IOtpDocument>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            index: true,
        },
        otp: {
            type: String,
            required: [true, 'OTP is required'],
        },
        attempts: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            required: true,
            // TTL index: MongoDB automatically deletes the document when expiresAt is reached
            index: { expires: 0 },
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

export const Otp = mongoose.model<IOtpDocument>('Otp', otpSchema);
