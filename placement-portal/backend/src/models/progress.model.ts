import mongoose, { Document, Schema } from 'mongoose';

/**
 * Progress document — tracks a user's progress through a course.
 * One document per user-course pair.
 */
export interface IProgressDocument extends Document {
    userId: mongoose.Types.ObjectId;
    courseId: mongoose.Types.ObjectId;
    completedLessons: string[]; // lesson ObjectId strings
    lastLessonId: string;
    percentage: number;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const progressSchema = new Schema<IProgressDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        completedLessons: [{ type: String }],
        lastLessonId: { type: String, default: '' },
        percentage: { type: Number, default: 0, min: 0, max: 100 },
        completedAt: { type: Date, default: null },
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

// One progress record per user per course
progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Progress = mongoose.model<IProgressDocument>('Progress', progressSchema);
