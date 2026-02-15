import mongoose, { Document, Schema } from 'mongoose';

/**
 * Lesson sub-document — a single video/lesson inside a course.
 */
export interface ILesson {
    _id?: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: number; // in minutes
    order: number;
}

const lessonSchema = new Schema<ILesson>({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    duration: { type: Number, required: true, min: 0 },
    order: { type: Number, required: true },
});

/**
 * Course document interface.
 */
export interface ICourseDocument extends Document {
    title: string;
    description: string;
    instructor: string;
    thumbnail: string;
    category: string;
    lessons: ILesson[];
    totalDuration: number;
    enrolledCount: number;
    isPublished: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema<ICourseDocument>(
    {
        title: {
            type: String,
            required: [true, 'Course title is required'],
            trim: true,
            maxlength: 200,
        },
        description: {
            type: String,
            required: [true, 'Course description is required'],
            maxlength: 2000,
        },
        instructor: { type: String, required: true, trim: true },
        thumbnail: { type: String, default: '' },
        category: {
            type: String,
            required: true,
            enum: ['dsa', 'web-dev', 'system-design', 'aptitude', 'soft-skills', 'other'],
        },
        lessons: [lessonSchema],
        totalDuration: { type: Number, default: 0 },
        enrolledCount: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false },
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

courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ title: 'text', description: 'text' });

export const Course = mongoose.model<ICourseDocument>('Course', courseSchema);
