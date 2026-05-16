import mongoose, { Document, Schema } from 'mongoose';

export interface IForumPostDocument extends Document {
    authorId: mongoose.Types.ObjectId;
    title: string;
    company: string;
    role: string;
    content: string;
    tags: string[];
    upvotes: mongoose.Types.ObjectId[];
    comments: {
        authorId: mongoose.Types.ObjectId;
        content: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const forumPostSchema = new Schema<IForumPostDocument>(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Post title is required'],
            trim: true,
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
            index: true,
        },
        role: {
            type: String,
            required: [true, 'Job role is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        tags: {
            type: [String],
            default: [],
        },
        upvotes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                authorId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
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

// Search index
forumPostSchema.index({ title: 'text', content: 'text', company: 'text' });

export const ForumPost = mongoose.model<IForumPostDocument>('ForumPost', forumPostSchema);
