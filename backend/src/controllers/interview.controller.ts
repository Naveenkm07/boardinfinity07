import { Request, Response, NextFunction } from 'express';
import { InterviewService } from '../services/interview.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

export class InterviewController {
    /**
     * POST /api/interview/start
     * Start a new mock interview session.
     */
    static async startInterview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const { type, topic } = req.body;

            if (!type || !topic) {
                res.status(400).json({ success: false, message: 'Interview type and topic are required' });
                return;
            }

            const interview = await InterviewService.startInterview(userId, type, topic);
            ApiResponse.success(res, { interview }, 'Interview started successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/interview/:id/message
     * Send a message to the AI recruiter.
     */
    static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const { content } = req.body;

            if (!content) {
                res.status(400).json({ success: false, message: 'Message content is required' });
                return;
            }

            const result = await InterviewService.sendMessage(req.params.id as string, userId, content);
            ApiResponse.success(res, result, 'Message processed successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/interview/me
     * Get current student's interview history.
     */
    static async getMyInterviews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const interviews = await InterviewService.getStudentInterviews(userId);
            ApiResponse.success(res, { interviews }, 'Interview history retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/interview/:id
     * Get interview details.
     */
    static async getInterviewById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const interview = await InterviewService.getInterviewById(req.params.id as string, userId);
            ApiResponse.success(res, { interview }, 'Interview details retrieved');
        } catch (error) {
            next(error);
        }
    }
}
