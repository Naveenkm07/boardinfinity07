import mongoose, { Document, Schema } from 'mongoose';

export type ApplicationStatus = 'applied' | 'shortlisted' | 'interview' | 'offered' | 'rejected';

export interface IApplicationDocument extends Document {
    jobId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    status: ApplicationStatus;
    resumeUrl: string;
    appliedAt: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const applicationSchema = new Schema<IApplicationDocument>(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'interview', 'offered', 'rejected'],
            default: 'applied',
        },
        resumeUrl: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Ensure a student can only apply once to a specific job
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

export const Application = mongoose.model<IApplicationDocument>('Application', applicationSchema);
