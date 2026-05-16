import { Request, Response, NextFunction } from 'express';
import { GamificationService } from '../services/gamification.service';
import { ApiResponse } from '../utils/ApiResponse';

export class LeaderboardController {
    /**
     * GET /api/leaderboard
     * Get the top students by points.
     */
    static async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const students = await GamificationService.getLeaderboard(limit);

            ApiResponse.success(res, { students }, 'Leaderboard retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}
