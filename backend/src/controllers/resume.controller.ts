import { Request, Response, NextFunction } from 'express';
import { ResumeService } from '../services/resume.service';
import { AIService } from '../services/ai.service';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';
import { ApiError } from '../utils/ApiError';

export class ResumeController {
    /**
     * POST /api/resume/parse
     * Upload a PDF resume, parse it, and return the text.
     */
    static async parse(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.file) {
                throw ApiError.badRequest('No resume file uploaded');
            }

            const text = await ResumeService.parseResume(req.file.buffer);
            ApiResponse.success(res, { text }, 'Resume parsed successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/resume/score
     * Parse resume and score it against a job description.
     */
    static async score(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { jobDescription } = req.body;
            if (!req.file) {
                throw ApiError.badRequest('No resume file uploaded');
            }
            if (!jobDescription) {
                throw ApiError.badRequest('Job description is required');
            }

            const resumeText = await ResumeService.parseResume(req.file.buffer);
            const scoringResult = await AIService.scoreResume(resumeText, jobDescription);

            ApiResponse.success(res, scoringResult, 'Resume scored successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/resume/upload-to-profile
     * Upload resume, parse it, and update user's profile skills/bio.
     */
    static async uploadToProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            if (!req.file) {
                throw ApiError.badRequest('No resume file uploaded');
            }

            const fs = require('fs');
            const dataBuffer = fs.readFileSync(req.file.path);
            const resumeText = await ResumeService.parseResume(dataBuffer);
            
            // Extract skills from resume
            const { extractSkills } = require('../utils/pdfParser');
            const skills = extractSkills(resumeText);
            
            // Construct the public URL for the resume
            // In a real app, this would be a Cloudinary URL or similar
            // For local development, we'll use a relative path from the server root
            const resumeUrl = `/uploads/resumes/${req.file.filename}`;
            
            // Update user profile
            const user = await UserService.updateProfile(userId, {
                resumeUrl,
                skills: skills.length > 0 ? skills : undefined,
                // We could also update the bio here if we wanted to
            });
            
            ApiResponse.success(
                res, 
                { 
                    user: user.toJSON(),
                    text: resumeText,
                    resumeUrl 
                }, 
                'Resume uploaded and profile updated'
            );
        } catch (error) {
            next(error);
        }
    }
}
