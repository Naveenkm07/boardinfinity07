import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/job.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest, UserRole } from '../types';
import { CONSTANTS } from '../utils/constants';
import { AIService } from '../services/ai.service';
import { extractTextFromPDF } from '../utils/pdfParser';
import { JobApplication } from '../models/job.model';
import fs from 'fs';
import { UserService } from '../services/user.service';
import { GamificationService, GamificationAction } from '../services/gamification.service';
import { NotificationService, NotificationType } from '../services/notification.service';

export class JobController {
    /**
     * GET /api/jobs/recommendations
     * Get recommended jobs for the current student.
     */
    static async getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const user = await UserService.getUserById(userId);

            const recommendations = await JobService.getRecommendedJobs(user.skills || []);
            ApiResponse.success(res, { jobs: recommendations }, 'Recommendations retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/jobs/applications/:id/score
     * Use AI to score an application (Admin only).
     */
    static async scoreApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const application = await JobApplication.findById(req.params.id as string).populate('jobId');
            if (!application) {
                res.status(404).json({ success: false, message: 'Application not found' });
                return;
            }

            const job = application.jobId as any;
            const resumePath = application.resumeUrl;

            if (!fs.existsSync(resumePath)) {
                res.status(400).json({ success: false, message: 'Resume file not found on server' });
                return;
            }

            const resumeText = await extractTextFromPDF(resumePath);
            const jobDescription = `
                Title: ${job.title}
                Company: ${job.company}
                Description: ${job.description}
                Requirements: ${job.requirements?.join(', ')}
                Skills: ${job.skills?.join(', ')}
            `;

            const analysis = await AIService.scoreResume(resumeText, jobDescription);

            // Update application with AI results
            application.aiScore = analysis.score;
            application.aiAnalysis = analysis;
            await application.save();

            ApiResponse.success(res, { analysis }, 'Application scored successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/jobs
     * Create a new job (Admin only).
     */
    static async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const job = await JobService.createJob({ ...req.body, createdBy: userId as any });
            
            // Broadcast to all students
            NotificationService.broadcast({
                type: NotificationType.JOB_POSTED,
                title: 'New Job Opportunity!',
                message: `${job.company} is hiring for ${job.title}`,
                data: { jobId: job.id }
            });

            ApiResponse.success(res, job, 'Job created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/jobs
     * List jobs.
     */
    static async listJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || CONSTANTS.DEFAULT_PAGE);
            const limit = Math.min(
                CONSTANTS.MAX_LIMIT,
                Math.max(1, parseInt(req.query.limit as string) || CONSTANTS.DEFAULT_LIMIT),
            );
            
            const filters: any = {};
            if (req.query.company) filters.company = new RegExp(req.query.company as string, 'i');
            if (req.query.location) filters.location = new RegExp(req.query.location as string, 'i');
            if (req.query.type) filters.type = req.query.type;

            const result = await JobService.listJobs(page, limit, filters);
            ApiResponse.success(res, result, 'Jobs retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/jobs/:id
     * Get job details.
     */
    static async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const job = await JobService.getJobById(req.params.id as string);
            ApiResponse.success(res, job, 'Job details retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/jobs/:id
     * Update job (Admin only).
     */
    static async updateJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const job = await JobService.updateJob(req.params.id as string, req.body);
            ApiResponse.success(res, job, 'Job updated successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/jobs/:id
     * Delete job (Admin only).
     */
    static async deleteJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await JobService.deleteJob(req.params.id as string);
            ApiResponse.success(res, null, 'Job deleted successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/jobs/:id/apply
     * Apply for a job (Student only).
     */
    static async applyForJob(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const studentId = (req as AuthRequest).user!.userId;
            const { resumeUrl } = req.body;
            
            if (!resumeUrl) {
                res.status(400).json({ success: false, message: 'Resume URL is required' });
                return;
            }

            const application = await JobService.applyForJob(req.params.id as string, studentId, resumeUrl);
            
            // Award points for applying
            await GamificationService.awardPoints(studentId, GamificationAction.APPLY_JOB);
            
            ApiResponse.success(res, application, 'Applied successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/jobs/applications/me
     * Get current student's applications.
     */
    static async getMyApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const studentId = (req as AuthRequest).user!.userId;
            const applications = await JobService.getStudentApplications(studentId);
            ApiResponse.success(res, { applications }, 'Applications retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/jobs/:id/applications
     * Get applications for a job (Admin only).
     */
    static async getJobApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const applications = await JobService.getJobApplications(req.params.id as string);
            ApiResponse.success(res, { applications }, 'Job applications retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/jobs/applications/:id/status
     * Update application status (Admin only).
     */
    static async updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { status } = req.body;
            const application = await JobService.updateApplicationStatus(req.params.id as string, status);
            
            // Send real-time notification to the student
            NotificationService.sendToUser(application.studentId.toString(), {
                type: NotificationType.APPLICATION_STATUS,
                title: 'Application Update',
                message: `Your application for ${(application.jobId as any).title} has been updated to: ${status}`,
                data: { applicationId: application.id, status }
            });

            ApiResponse.success(res, application, 'Application status updated');
        } catch (error) {
            next(error);
        }
    }
}
