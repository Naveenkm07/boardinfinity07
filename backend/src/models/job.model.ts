import mongoose, { Document, Schema } from 'mongoose';

/**
 * Job document interface.
 */
export type JobType = 'full-time' | 'part-time' | 'internship' | 'contract';
export type JobStatus = 'open' | 'closed' | 'draft';

export interface IJobDocument extends Document {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    skills: string[];
    salary?: string;
    type: JobType;
    status: JobStatus;
    deadline: Date;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const jobSchema = new Schema<IJobDocument>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        company: { type: String, required: true, trim: true, maxlength: 100 },
        location: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        requirements: [{ type: String }],
        skills: [{ type: String }],
        salary: { type: String },
        type: {
            type: String,
            enum: ['full-time', 'part-time', 'internship', 'contract'],
            default: 'full-time',
        },
        status: {
            type: String,
            enum: ['open', 'closed', 'draft'],
            default: 'open',
        },
        deadline: { type: Date, required: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret) {
                ret.id = ret._id;
                delete (ret as any)._id;
                delete (ret as any).__v;
                return ret;
            },
        },
    },
);

jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ company: 1 });

export const Job = mongoose.model<IJobDocument>('Job', jobSchema);

/**
 * Job Application document interface.
 */
export type ApplicationStatus = 'applied' | 'shortlisted' | 'interview' | 'offered' | 'rejected';

export interface IJobApplicationDocument extends Document {
    jobId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    resumeUrl: string;
    status: ApplicationStatus;
    aiScore?: number;
    aiAnalysis?: {
        matchReason: string;
        missingSkills: string[];
        strengths: string[];
        suggestions: string[];
    };
    appliedAt: Date;
    updatedAt: Date;
}

const applicationSchema = new Schema<IJobApplicationDocument>(
    {
        jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        resumeUrl: { type: String, required: true },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'interview', 'offered', 'rejected'],
            default: 'applied',
        },
        aiScore: { type: Number },
        aiAnalysis: {
            matchReason: String,
            missingSkills: [String],
            strengths: [String],
            suggestions: [String],
        },
    },
    {
        timestamps: { createdAt: 'appliedAt', updatedAt: 'updatedAt' },
        toJSON: {
            transform(_doc, ret) {
                ret.id = ret._id;
                delete (ret as any)._id;
                delete (ret as any).__v;
                return ret;
            },
        },
    },
);

applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

export const JobApplication = mongoose.model<IJobApplicationDocument>('JobApplication', applicationSchema);
