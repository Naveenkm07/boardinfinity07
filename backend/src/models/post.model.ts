import mongoose, { Document, Schema } from 'mongoose';

/**
 * Comment sub-document.
 */
interface IComment {
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
}

const commentSchema = new Schema<IComment>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

/**
 * Post document interface.
 */
export interface IPostDocument extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    company: string;
    role?: string;
    tags: string[];
    upvotes: mongoose.Types.ObjectId[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPostDocument>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: 200,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            maxlength: 5000,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        role: {
            type: String,
            trim: true,
        },
        tags: [String],
        upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [commentSchema],
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
    }
);

postSchema.index({ title: 'text', content: 'text', company: 'text' });

export const Post = mongoose.model<IPostDocument>('Post', postSchema);
