import { Job, JobApplication, IJobDocument, IJobApplicationDocument, JobStatus, ApplicationStatus } from '../models/job.model';
import { ApiError } from '../utils/ApiError';
import { NotificationService, NotificationType } from './notification.service';

export class JobService {
    /**
     * Get recommended jobs for a student based on their skills.
     */
    static async getRecommendedJobs(studentSkills: string[]): Promise<IJobDocument[]> {
        if (!studentSkills || studentSkills.length === 0) {
            return Job.find({ status: 'open' }).sort({ createdAt: -1 }).limit(5);
        }

        const jobs = await Job.find({ status: 'open' });
        
        const scoredJobs = jobs.map(job => {
            const jobSkills = job.skills || [];
            const matchingSkills = studentSkills.filter(skill => 
                jobSkills.some(js => js.toLowerCase() === skill.toLowerCase()) ||
                job.description.toLowerCase().includes(skill.toLowerCase()) ||
                job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
            );
            
            return {
                job,
                score: matchingSkills.length / (jobSkills.length || 1)
            };
        });

        return scoredJobs
            .sort((a, b) => b.score - a.score)
            .filter(item => item.score > 0)
            .slice(0, 6)
            .map(item => item.job);
    }

    /**
     * Create a new job posting.
     */
    static async createJob(data: Partial<IJobDocument>): Promise<IJobDocument> {
        const job = await Job.create(data);
        
        // Broadcast notification for new job
        NotificationService.broadcast({
            type: NotificationType.JOB_POSTED,
            title: 'New Job Opening',
            message: `${job.company} is hiring for ${job.title}!`,
            link: '/student/jobs'
        });

        return job;
    }

    /**
     * Get all jobs with filters and pagination.
     */
    static async listJobs(page: number, limit: number, filters: any = {}): Promise<{ jobs: IJobDocument[]; total: number }> {
        const skip = (page - 1) * limit;
        const query = { status: 'open', ...filters };
        
        const [jobs, total] = await Promise.all([
            Job.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('createdBy', 'name'),
            Job.countDocuments(query),
        ]);

        return { jobs, total };
    }

    /**
     * Get job details by ID.
     */
    static async getJobById(id: string): Promise<IJobDocument> {
        const job = await Job.findById(id).populate('createdBy', 'name');
        if (!job) {
            throw ApiError.notFound('Job not found');
        }
        return job;
    }

    /**
     * Update job posting.
     */
    static async updateJob(id: string, data: Partial<IJobDocument>): Promise<IJobDocument> {
        const job = await Job.findByIdAndUpdate(id, data, { new: true });
        if (!job) {
            throw ApiError.notFound('Job not found');
        }
        return job;
    }

    /**
     * Delete job posting.
     */
    static async deleteJob(id: string): Promise<void> {
        const job = await Job.findByIdAndDelete(id);
        if (!job) {
            throw ApiError.notFound('Job not found');
        }
        await JobApplication.deleteMany({ jobId: id });
    }

    /**
     * Apply for a job.
     */
    static async applyForJob(jobId: string, studentId: string, resumeUrl: string): Promise<IJobApplicationDocument> {
        const job = await Job.findById(jobId);
        if (!job || job.status !== 'open') {
            throw ApiError.badRequest('Job is not open for applications');
        }

        const existing = await JobApplication.findOne({ jobId, studentId });
        if (existing) {
            throw ApiError.badRequest('You have already applied for this job');
        }

        const application = await JobApplication.create({
            jobId,
            studentId,
            resumeUrl,
        });

        return application;
    }

    /**
     * Get student's applications.
     */
    static async getStudentApplications(studentId: string): Promise<IJobApplicationDocument[]> {
        return JobApplication.find({ studentId }).populate('jobId').sort({ appliedAt: -1 });
    }

    /**
     * Get applications for a job (Admin only).
     */
    static async getJobApplications(jobId: string): Promise<IJobApplicationDocument[]> {
        return JobApplication.find({ jobId }).populate('studentId', 'name email department rollNumber phone').sort({ appliedAt: -1 });
    }

    /**
     * Update application status (Admin only).
     */
    static async updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<IJobApplicationDocument> {
        const application = await JobApplication.findById(applicationId)
            .populate('studentId', 'name email')
            .populate('jobId', 'title company');
            
        if (!application) {
            throw ApiError.notFound('Application not found');
        }

        application.status = status;
        await application.save();

        const student = application.studentId as any;
        const job = application.jobId as any;

        // Send socket notification
        if (student?._id) {
            NotificationService.sendToUser(student._id.toString(), {
                type: NotificationType.APPLICATION_STATUS,
                title: 'Application Status Updated',
                message: `Your application for ${job.title} at ${job.company} is now: ${status}`,
                link: '/student/jobs',
                data: { applicationId, status }
            });
        }

        // Send notification email
        if (student?.email && job) {
            const { sendApplicationStatusEmail } = require('./email.service');
            sendApplicationStatusEmail(
                student.email,
                student.name,
                job.title,
                job.company,
                status
            ).catch((err: any) => console.error('Failed to send status email:', err));
        }

        return application;
    }
}
