import mongoose, { Document, Schema } from 'mongoose';

export type ResourceType = 'interview-guide' | 'blog' | 'video' | 'document';

export interface IResourceDocument extends Document {
    title: string;
    company: string;
    type: ResourceType;
    content: string;
    url: string;
    tags: string[];
    isPublished: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const resourceSchema = new Schema<IResourceDocument>(
    {
        title: { type: String, required: true, trim: true, maxlength: 300 },
        company: { type: String, default: '', trim: true },
        type: {
            type: String,
            enum: ['interview-guide', 'blog', 'video', 'document'],
            required: true,
        },
        content: { type: String, default: '' },
        url: { type: String, default: '' },
        tags: [{ type: String, trim: true, lowercase: true }],
        isPublished: { type: Boolean, default: true },
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

resourceSchema.index({ title: 'text', company: 'text', tags: 'text' });
resourceSchema.index({ type: 1, isPublished: 1 });

export const Resource = mongoose.model<IResourceDocument>('Resource', resourceSchema);
