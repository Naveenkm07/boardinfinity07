import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

export class DashboardController {
    static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await DashboardService.getStats((req as AuthRequest).user!.userId);
            ApiResponse.success(res, stats, 'Dashboard stats retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async getUpcoming(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = await DashboardService.getUpcoming((req as AuthRequest).user!.userId);
            ApiResponse.success(res, data, 'Upcoming items retrieved');
        } catch (error) {
            next(error);
        }
    }
}
