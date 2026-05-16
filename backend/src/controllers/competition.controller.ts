import { Request, Response, NextFunction } from 'express';
import { CompetitionService } from '../services/competition.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';
import { CompetitionStatus } from '../models/competition.model';

export class CompetitionController {
    static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as CompetitionStatus | undefined;
            const difficulty = req.query.difficulty as string | undefined;
            const data = await CompetitionService.listCompetitions(page, limit, status, difficulty);
            ApiResponse.success(res, data, 'Competitions retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const competition = await CompetitionService.getCompetitionById(req.params.id as string);
            ApiResponse.success(res, { competition }, 'Competition retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const competition = await CompetitionService.createCompetition(
                req.body,
                (req as AuthRequest).user!.userId,
            );
            ApiResponse.created(res, { competition }, 'Competition created');
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const competition = await CompetitionService.updateCompetition(req.params.id as string, req.body);
            ApiResponse.success(res, { competition }, 'Competition updated');
        } catch (error) {
            next(error);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await CompetitionService.deleteCompetition(req.params.id as string);
            ApiResponse.success(res, null, 'Competition deleted');
        } catch (error) {
            next(error);
        }
    }

    static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const competition = await CompetitionService.registerForCompetition(
                req.params.id as string,
                (req as AuthRequest).user!.userId,
            );
            ApiResponse.success(res, { competition }, 'Registered for competition');
        } catch (error) {
            next(error);
        }
    }
}
