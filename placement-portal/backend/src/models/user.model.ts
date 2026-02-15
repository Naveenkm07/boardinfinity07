import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../types';

/**
 * User document interface for Mongoose.
 */
export interface IUserDocument extends Document {
    email: string;
    name: string;
    role: UserRole;
    isVerified: boolean;
    department?: string;
    rollNumber?: string;
    phone?: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User schema.
 * No password field — authentication is handled via email OTP only.
 */
const userSchema = new Schema<IUserDocument>(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.STUDENT,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        department: {
            type: String,
            trim: true,
        },
        rollNumber: {
            type: String,
            trim: true,
            sparse: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        profileImage: {
            type: String,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
        toJSON: {
            // Transform output when converting to JSON (e.g., for API responses)
            transform(_doc, ret) {
                ret.id = ret._id;
                delete (ret as any)._id;
                delete (ret as any).__v;
                return ret;
            },
        },
    },
);

// Compound index for common queries
userSchema.index({ role: 1, department: 1 });

export const User = mongoose.model<IUserDocument>('User', userSchema);
