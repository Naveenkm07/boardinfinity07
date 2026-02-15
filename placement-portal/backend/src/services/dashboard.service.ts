import { Course } from '../models/course.model';
import { Progress } from '../models/progress.model';
import { Session } from '../models/session.model';
import { Assessment, AssessmentResult } from '../models/assessment.model';

/**
 * Dashboard Service — aggregates data for the student dashboard.
 */
export class DashboardService {
    /**
     * Get dashboard stats for a student.
     */
    static async getStats(userId: string) {
        const [enrolledCourses, completedCourses, upcomingSessions, pendingAssessments] =
            await Promise.all([
                Progress.countDocuments({ userId }),
                Progress.countDocuments({ userId, percentage: 100 }),
                Session.countDocuments({ status: 'upcoming', scheduledAt: { $gte: new Date() } }),
                Assessment.countDocuments({ status: 'active', dueDate: { $gte: new Date() } }),
            ]);

        return {
            enrolledCourses,
            completedCourses,
            upcomingSessions,
            pendingAssessments,
        };
    }

    /**
     * Get upcoming items (sessions + assessments) for the dashboard.
     */
    static async getUpcoming(userId: string) {
        const [sessions, assessments, courseProgress] = await Promise.all([
            Session.find({ status: 'upcoming', scheduledAt: { $gte: new Date() } })
                .sort({ scheduledAt: 1 })
                .limit(5)
                .lean(),
            Assessment.find({ status: 'active', dueDate: { $gte: new Date() } })
                .sort({ dueDate: 1 })
                .limit(5)
                .lean(),
            Progress.find({ userId, percentage: { $lt: 100 } })
                .populate('courseId', 'title thumbnail category')
                .sort({ updatedAt: -1 })
                .limit(5)
                .lean(),
        ]);

        return { sessions, assessments, courseProgress };
    }
}
