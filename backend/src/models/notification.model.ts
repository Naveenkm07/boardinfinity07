import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType = 'info' | 'success' | 'warning' | 'alert';

export interface INotificationDocument extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    link?: string;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: ['info', 'success', 'warning', 'alert'], default: 'info' },
        isRead: { type: Boolean, default: false },
        link: { type: String },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_doc, ret: any) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>('Notification', notificationSchema);
