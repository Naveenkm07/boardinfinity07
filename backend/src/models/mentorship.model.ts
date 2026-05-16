import mongoose, { Document, Schema } from 'mongoose';

export type MentorshipStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IMentorshipDocument extends Document {
    mentorId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    dateTime: Date;
    status: MentorshipStatus;
    topic: string;
    message?: string;
    meetingLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

const mentorshipSchema = new Schema<IMentorshipDocument>(
    {
        mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        dateTime: { type: Date, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        topic: { type: String, required: true },
        message: { type: String },
        meetingLink: { type: String },
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

mentorshipSchema.index({ mentorId: 1, dateTime: 1 });
mentorshipSchema.index({ studentId: 1 });

export const Mentorship = mongoose.model<IMentorshipDocument>('Mentorship', mentorshipSchema);
