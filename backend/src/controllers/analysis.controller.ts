import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

export class AnalysisController {
    /**
     * GET /api/analysis/skill-gap
     * Get a personalized skill gap analysis for the student.
     */
    static async getSkillGapAnalysis(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const analysis = await AnalysisService.getSkillGapAnalysis(userId);
            
            ApiResponse.success(res, analysis, 'Skill gap analysis retrieved successfully');
        } catch (error) {
            next(error);
        }
    }
}
