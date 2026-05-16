import { Request, Response, NextFunction } from 'express';
import { ExperienceService } from '../services/experience.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';
import { GamificationService, GamificationAction } from '../services/gamification.service';
import { CONSTANTS } from '../utils/constants';

export class ExperienceController {
    static async createExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const experience = await ExperienceService.createExperience({ ...req.body, author: userId as any });
            
            // Award points for sharing experience
            await GamificationService.awardPoints(userId, GamificationAction.POST_EXPERIENCE);

            ApiResponse.success(res, experience, 'Experience shared successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    static async listExperiences(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || CONSTANTS.DEFAULT_PAGE);
            const limit = Math.min(CONSTANTS.MAX_LIMIT, Math.max(1, parseInt(req.query.limit as string) || CONSTANTS.DEFAULT_LIMIT));
            
            const filters: any = {};
            if (req.query.company) filters.company = new RegExp(req.query.company as string, 'i');
            if (req.query.tag) filters.tags = req.query.tag;

            const result = await ExperienceService.listExperiences(page, limit, filters);
            ApiResponse.success(res, result, 'Experiences retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    static async getExperienceById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const experience = await ExperienceService.getExperienceById(req.params.id);
            ApiResponse.success(res, experience, 'Experience details retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async updateExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const experience = await ExperienceService.updateExperience(req.params.id, userId, req.body);
            ApiResponse.success(res, experience, 'Experience updated successfully');
        } catch (error) {
            next(error);
        }
    }

    static async deleteExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            await ExperienceService.deleteExperience(req.params.id, userId);
            ApiResponse.success(res, null, 'Experience deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    static async upvoteExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const experience = await ExperienceService.upvoteExperience(req.params.id, userId);
            ApiResponse.success(res, experience, 'Upvoted successfully');
        } catch (error) {
            next(error);
        }
    }

    static async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const { content } = req.body;
            const experience = await ExperienceService.addComment(req.params.id, userId, content);
            ApiResponse.success(res, experience, 'Comment added successfully');
        } catch (error) {
            next(error);
        }
    }
}
