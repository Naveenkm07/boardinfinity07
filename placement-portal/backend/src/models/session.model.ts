import mongoose, { Document, Schema } from 'mongoose';

export type SessionStatus = 'upcoming' | 'completed' | 'cancelled';

export interface ISessionDocument extends Document {
    title: string;
    description: string;
    host: string;
    scheduledAt: Date;
    duration: number; // minutes
    meetingLink: string;
    status: SessionStatus;
    attendees: mongoose.Types.ObjectId[];
    maxAttendees: number;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema<ISessionDocument>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        description: { type: String, default: '', maxlength: 2000 },
        host: { type: String, required: true, trim: true },
        scheduledAt: { type: Date, required: true },
        duration: { type: Number, required: true, min: 15 },
        meetingLink: { type: String, default: '' },
        status: {
            type: String,
            enum: ['upcoming', 'completed', 'cancelled'],
            default: 'upcoming',
        },
        attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        maxAttendees: { type: Number, default: 100 },
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

sessionSchema.index({ status: 1, scheduledAt: 1 });

export const Session = mongoose.model<ISessionDocument>('Session', sessionSchema);
