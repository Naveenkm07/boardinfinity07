import mongoose, { Document, Schema } from 'mongoose';

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

export interface IBookingDocument extends Document {
    alumniId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    scheduledAt: Date;
    duration: number; // in minutes
    status: BookingStatus;
    meetingLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBookingDocument>(
    {
        alumniId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        studentId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        scheduledAt: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            default: 30,
        },
        status: {
            type: String,
            enum: Object.values(BookingStatus),
            default: BookingStatus.PENDING,
        },
        meetingLink: {
            type: String,
            trim: true,
        },
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

export const Booking = mongoose.model<IBookingDocument>('Booking', bookingSchema);
