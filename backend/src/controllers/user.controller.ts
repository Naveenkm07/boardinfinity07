import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AIService } from '../services/ai.service';
import { GitHubService } from '../services/github.service';
import { GamificationService, GamificationAction } from '../services/gamification.service';
import { ApiResponse } from '../utils/ApiResponse';
import { UserRole, AuthRequest } from '../types';
import { CONSTANTS } from '../utils/constants';
import { extractTextFromPDF, extractSkillsAI } from '../utils/pdfParser';
import { User } from '../models/user.model';

/**
 * User Controller.
 * Handles user profile management and admin user listing.
 */
export class UserController {
    /**
     * POST /api/users/resume
     * Upload and parse a student's resume.
     */
    static async uploadResume(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No resume file uploaded' });
                return;
            }

            const userId = (req as AuthRequest).user!.userId;
            const filePath = req.file.path;

            // Extract text from PDF
            const text = await extractTextFromPDF(filePath);

            // Extract skills from text
            const skills = await extractSkillsAI(text);

            // Update user profile with resume URL and skills
            const user = await UserService.updateProfile(userId, {
                resumeUrl: filePath, // In production, this would be a URL to S3/Cloudinary
                skills: skills,
            });

            // Award points for resume upload
            await GamificationService.awardPoints(userId, GamificationAction.UPLOAD_RESUME);

            ApiResponse.success(
                res,
                {
                    user: user.toJSON(),
                    extractedSkills: skills,
                    resumeUrl: filePath,
                },
                'Resume uploaded and parsed successfully',
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/users/score-resume
     * Score the user's current resume against a job description.
     */
    static async scoreResume(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { jobDescription } = req.body;
            const userId = (req as AuthRequest).user!.userId;

            if (!jobDescription) {
                res.status(400).json({ success: false, message: 'Job description is required' });
                return;
            }

            const user = await UserService.getUserById(userId);
            if (!user.resumeUrl) {
                res.status(400).json({ success: false, message: 'Please upload your resume first' });
                return;
            }

            // Extract text from the saved resume PDF
            const resumeText = await extractTextFromPDF(user.resumeUrl);

            // Use AI to score
            const result = await AIService.scoreResume(resumeText, jobDescription);

            ApiResponse.success(res, result, 'Resume scored successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/users/sync-github
     * Sync top repositories from GitHub.
     */
    static async syncGithub(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const user = await UserService.getUserById(userId);

            if (!user.socialLinks?.github) {
                res.status(400).json({ success: false, message: 'GitHub URL not found in profile' });
                return;
            }

            const repos = await GitHubService.fetchTopRepos(user.socialLinks.github);
            
            user.githubRepos = repos;
            await user.save();

            // Award points for GitHub sync
            await GamificationService.awardPoints(userId, GamificationAction.SYNC_GITHUB);

            ApiResponse.success(res, { repos }, 'GitHub repositories synced successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/users/portfolio/:username
     * Get public portfolio data by username.
     */
    static async getPublicPortfolio(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.params;
            const user = await User.findOne({ username }).select('-email -phone -role -isVerified');

            if (!user) {
                res.status(404).json({ success: false, message: 'Portfolio not found' });
                return;
            }

            ApiResponse.success(res, { user }, 'Portfolio retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/users/profile
     * Get the authenticated user's profile.
     */
    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await UserService.getUserById((req as AuthRequest).user!.userId);
            ApiResponse.success(res, { user: user.toJSON() }, 'Profile retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/users/leaderboard
     * Get the top students by points.
     */
    static async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const leaderboard = await UserService.getLeaderboard(limit);
            ApiResponse.success(res, { leaderboard }, 'Leaderboard retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/users/profile
     * Update the authenticated user's profile.
     */
    static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const updates = req.body;
            const userId = (req as AuthRequest).user!.userId;
            const user = await UserService.updateProfile(userId, updates);

            // Award points for profile update (one-time logic could be added but for MVP just award)
            await GamificationService.awardPoints(userId, GamificationAction.PROFILE_COMPLETE);

            ApiResponse.success(res, { user: user.toJSON() }, 'Profile updated');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/users
     * List all users (admin only). Supports pagination and role filtering.
     */
    static async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || CONSTANTS.DEFAULT_PAGE);
            const limit = Math.min(
                CONSTANTS.MAX_LIMIT,
                Math.max(1, parseInt(req.query.limit as string) || CONSTANTS.DEFAULT_LIMIT),
            );
            const role = req.query.role as UserRole | undefined;

            const result = await UserService.listUsers(page, limit, role);
            ApiResponse.success(res, result, 'Users retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/users/:id
     * Delete a user (admin only).
     */
    static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await UserService.deleteUser(req.params.id as string);
            ApiResponse.success(res, null, 'User deleted');
        } catch (error) {
            next(error);
        }
    }
}
