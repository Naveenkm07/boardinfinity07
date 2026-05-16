import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

export class NotificationController {
    static async getMyNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const notifications = await NotificationService.getUserNotifications(userId);
            ApiResponse.success(res, { notifications }, 'Notifications retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const notification = await NotificationService.markAsRead(req.params.id, userId);
            ApiResponse.success(res, notification, 'Notification marked as read');
        } catch (error) {
            next(error);
        }
    }

    static async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            await NotificationService.markAllAsRead(userId);
            ApiResponse.success(res, null, 'All notifications marked as read');
        } catch (error) {
            next(error);
        }
    }
}
