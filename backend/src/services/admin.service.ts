import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Session } from '../models/session.model';
import { Assessment, AssessmentResult } from '../models/assessment.model';
import { Progress } from '../models/progress.model';

/**
 * Admin Service — analytics, user management, and content management.
 */
export class AdminService {
    /**
     * Get platform-wide analytics.
     */
    static async getAnalytics() {
        const [
            totalUsers,
            totalStudents,
            totalCourses,
            totalSessions,
            totalAssessments,
            averageProgress,
            recentSignups,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'student' }),
            Course.countDocuments({ isPublished: true }),
            Session.countDocuments(),
            Assessment.countDocuments(),
            Progress.aggregate([{ $group: { _id: null, avg: { $avg: '$percentage' } } }]),
            User.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select('name email role createdAt')
                .lean(),
        ]);

        return {
            totalUsers,
            totalStudents,
            totalAdmins: totalUsers - totalStudents,
            totalCourses,
            totalSessions,
            totalAssessments,
            averageProgress: averageProgress[0]?.avg || 0,
            recentSignups,
        };
    }

    /**
     * List users with pagination and role filter.
     */
    static async listUsers(page: number, limit: number, role?: string) {
        const filter: Record<string, unknown> = {};
        if (role) filter.role = role;

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments(filter),
        ]);

        return { users, total, page, totalPages: Math.ceil(total / limit) };
    }

    /**
     * Update a user's role.
     */
    static async updateUserRole(userId: string, role: string) {
        const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
        if (!user) throw new Error('User not found');
        return user.toJSON();
    }

    /**
     * Get assessment results across all users.
     */
    static async getAssessmentResults(assessmentId: string) {
        const results = await AssessmentResult.find({ assessmentId })
            .populate('userId', 'name email department')
            .sort({ percentage: -1 })
            .lean();

        return results;
    }
}
