import { Notification, INotificationDocument, NotificationType as ModelNotificationType } from '../models/notification.model';
import { getIO } from '../utils/socket';
import { ApiError } from '../utils/ApiError';

export enum NotificationType {
    JOB_POSTED = 'JOB_POSTED',
    APPLICATION_STATUS = 'APPLICATION_STATUS',
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
    ASSESSMENT_GRADED = 'ASSESSMENT_GRADED',
    SYSTEM = 'SYSTEM',
}

export interface NotificationPayload {
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    link?: string;
}

export class NotificationService {
    /**
     * Get all notifications for a user.
     */
    static async getUserNotifications(userId: string): Promise<INotificationDocument[]> {
        return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
    }

    /**
     * Mark a notification as read.
     */
    static async markAsRead(notificationId: string, userId: string): Promise<INotificationDocument> {
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            throw ApiError.notFound('Notification not found');
        }

        return notification;
    }

    /**
     * Mark all notifications as read for a user.
     */
    static async markAllAsRead(userId: string): Promise<void> {
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    }

    /**
     * Send a notification to a specific user (saves to DB and emits via socket).
     */
    static async sendToUser(userId: string, payload: NotificationPayload) {
        try {
            // Map our enum to the model's type
            let modelType: ModelNotificationType = 'info';
            if (payload.type === NotificationType.APPLICATION_STATUS) modelType = 'success';
            
            // Save to database
            const notification = await Notification.create({
                userId,
                title: payload.title,
                message: payload.message,
                type: modelType,
                link: payload.link,
            });

            // Emit via socket
            const io = getIO();
            io.to(userId).emit('notification', notification.toJSON());
            
            return notification;
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }

    /**
     * Broadcast a notification to all users (emits via socket, optionally saves to DB).
     */
    static async broadcast(payload: NotificationPayload) {
        try {
            const io = getIO();
            io.emit('notification', {
                ...payload,
                id: `broadcast_${Date.now()}`,
                timestamp: new Date().toISOString(),
                isRead: false,
            });
        } catch (error) {
            console.error('Failed to broadcast notification:', error);
        }
    }
}
