import mongoose, { Document, Schema } from 'mongoose';

export interface ITrackItem {
    type: 'course' | 'assessment' | 'resource' | 'experience';
    itemId: mongoose.Types.ObjectId;
    order: number;
}

export interface ITrackDocument extends Document {
    title: string;
    companyName: string;
    description: string;
    icon: string;
    bannerImage?: string;
    items: ITrackItem[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const trackItemSchema = new Schema<ITrackItem>({
    type: { type: String, enum: ['course', 'assessment', 'resource', 'experience'], required: true },
    itemId: { type: Schema.Types.ObjectId, required: true },
    order: { type: Number, required: true },
});

const trackSchema = new Schema<ITrackDocument>(
    {
        title: { type: String, required: true, trim: true },
        companyName: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        icon: { type: String, default: '🚀' },
        bannerImage: { type: String },
        items: [trackItemSchema],
        difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
        tags: [{ type: String }],
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

trackSchema.index({ companyName: 1 });
trackSchema.index({ tags: 1 });

export const Track = mongoose.model<ITrackDocument>('Track', trackSchema);
