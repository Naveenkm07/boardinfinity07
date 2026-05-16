import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
    _id?: string;
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
}

const commentSchema = new Schema<IComment>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export interface IExperienceDocument extends Document {
    title: string;
    company: string;
    role: string;
    content: string;
    tags: string[];
    upvotes: mongoose.Types.ObjectId[];
    comments: IComment[];
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const experienceSchema = new Schema<IExperienceDocument>(
    {
        title: { type: String, required: true, trim: true },
        company: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        tags: [{ type: String }],
        upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [commentSchema],
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

experienceSchema.index({ company: 1, role: 1 });
experienceSchema.index({ tags: 1 });

export const Experience = mongoose.model<IExperienceDocument>('Experience', experienceSchema);
