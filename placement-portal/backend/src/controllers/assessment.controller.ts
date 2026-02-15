import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from '../services/assessment.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

export class AssessmentController {
    static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string | undefined;
            const data = await AssessmentService.listAssessments(page, limit, status);
            ApiResponse.success(res, data, 'Assessments retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user?.userId;
            const data = await AssessmentService.getAssessmentById(req.params.id as string, userId);
            ApiResponse.success(res, data, 'Assessment retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const assessment = await AssessmentService.createAssessment(
                req.body,
                (req as AuthRequest).user!.userId,
            );
            ApiResponse.created(res, { assessment }, 'Assessment created');
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const assessment = await AssessmentService.updateAssessment(req.params.id as string, req.body);
            ApiResponse.success(res, { assessment }, 'Assessment updated');
        } catch (error) {
            next(error);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await AssessmentService.deleteAssessment(req.params.id as string);
            ApiResponse.success(res, null, 'Assessment deleted');
        } catch (error) {
            next(error);
        }
    }

    static async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await AssessmentService.submitAssessment(
                req.params.id as string,
                (req as AuthRequest).user!.userId,
                req.body.answers,
            );
            ApiResponse.success(res, { result }, 'Assessment submitted');
        } catch (error) {
            next(error);
        }
    }

    static async getResult(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await AssessmentService.getResult(
                req.params.id as string,
                (req as AuthRequest).user!.userId,
            );
            ApiResponse.success(res, { result }, 'Result retrieved');
        } catch (error) {
            next(error);
        }
    }
}
