import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../types';

/**
 * User document interface for Mongoose.
 */
export interface IUserDocument extends Document {
    email: string;
    username?: string;
    name: string;
    role: UserRole;
    isVerified: boolean;
    isAlumni: boolean;
    department?: string;
    rollNumber?: string;
    phone?: string;
    profileImage?: string;
    resumeUrl?: string;
    skills?: string[];
    summary?: string;
    githubRepos?: {
        name: string;
        description: string;
        html_url: string;
        stargazers_count: number;
        language: string;
    }[];
    experience?: {
        title: string;
        company: string;
        location?: string;
        startDate?: string;
        endDate?: string;
        current: boolean;
        description?: string;
    }[];
    education?: {
        school: string;
        degree: string;
        fieldOfStudy: string;
        startYear: number;
        endYear?: number;
    }[];
    socialLinks?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        portfolio?: string;
    };
    points: number;
    badges: {
        name: string;
        icon: string;
        earnedAt: Date;
    }[];
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
        username: {
            type: String,
            unique: true,
            sparse: true,
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
        isAlumni: {
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
        resumeUrl: {
            type: String,
        },
        skills: {
            type: [String],
            default: [],
        },
        summary: {
            type: String,
            trim: true,
        },
        githubRepos: [
            {
                name: String,
                description: String,
                html_url: String,
                stargazers_count: Number,
                language: String,
            },
        ],
        experience: [
            {
                title: String,
                company: String,
                location: String,
                startDate: String,
                endDate: String,
                current: Boolean,
                description: String,
            },
        ],
        education: [
            {
                school: String,
                degree: String,
                fieldOfStudy: String,
                startYear: Number,
                endYear: Number,
            },
        ],
        socialLinks: {
            github: String,
            linkedin: String,
            twitter: String,
            portfolio: String,
        },
        points: {
            type: Number,
            default: 0,
        },
        badges: [
            {
                name: String,
                icon: String,
                earnedAt: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
        toJSON: {
            // Transform output when converting to JSON (e.g., for API responses)
            transform(_doc, ret) {
                ret.id = ret._id;
                delete (ret as any)._id;
                delete (ret as any).password; // Just in case
                delete (ret as any).__v;
                return ret;
            },
        },
    },
);

// Compound index for common queries
userSchema.index({ role: 1, department: 1 });

export const User = mongoose.model<IUserDocument>('User', userSchema);
