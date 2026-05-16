import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services/session.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';
import { SessionStatus } from '../models/session.model';

export class SessionController {
    static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as SessionStatus | undefined;
            const data = await SessionService.listSessions(page, limit, status);
            ApiResponse.success(res, data, 'Sessions retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const session = await SessionService.getSessionById(req.params.id as string);
            ApiResponse.success(res, { session }, 'Session retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const session = await SessionService.createSession(req.body, (req as AuthRequest).user!.userId);
            ApiResponse.created(res, { session }, 'Session created');
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const session = await SessionService.updateSession(req.params.id as string, req.body);
            ApiResponse.success(res, { session }, 'Session updated');
        } catch (error) {
            next(error);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await SessionService.deleteSession(req.params.id as string);
            ApiResponse.success(res, null, 'Session deleted');
        } catch (error) {
            next(error);
        }
    }

    static async attend(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const session = await SessionService.attendSession(
                req.params.id as string,
                (req as AuthRequest).user!.userId,
            );
            ApiResponse.success(res, { session }, 'Registered for session');
        } catch (error) {
            next(error);
        }
    }
}
