import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../utils/ApiResponse';

export class AdminController {
    static async getAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const analytics = await AdminService.getAnalytics();
            ApiResponse.success(res, analytics, 'Analytics retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const role = req.query.role as string | undefined;
            const data = await AdminService.listUsers(page, limit, role);
            ApiResponse.success(res, data, 'Users retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { role } = req.body;
            const user = await AdminService.updateUserRole(req.params.id as string, role);
            ApiResponse.success(res, { user }, 'User role updated');
        } catch (error) {
            next(error);
        }
    }

    static async getAssessmentResults(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const results = await AdminService.getAssessmentResults(req.params.id as string);
            ApiResponse.success(res, { results }, 'Assessment results retrieved');
        } catch (error) {
            next(error);
        }
    }
}
