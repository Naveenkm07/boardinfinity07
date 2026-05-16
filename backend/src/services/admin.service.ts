import { User } from '../models/user.model';
import { Course } from '../models/course.model';
import { Session } from '../models/session.model';
import { Assessment, AssessmentResult } from '../models/assessment.model';
import { Progress } from '../models/progress.model';
import { Job, JobApplication } from '../models/job.model';

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
            totalJobs,
            totalApplications,
            averageProgress,
            recentSignups,
            applicationTrends,
            placementDist,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'student' }),
            Course.countDocuments({ isPublished: true }),
            Session.countDocuments(),
            Assessment.countDocuments(),
            Job.countDocuments(),
            JobApplication.countDocuments(),
            Progress.aggregate([{ $group: { _id: null, avg: { $avg: '$percentage' } } }]),
            User.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .select('name email role createdAt')
                .lean(),
            // Real application trends (last 6 months)
            JobApplication.aggregate([
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { '_id': 1 } },
                { $limit: 6 }
            ]),
            // Real placement distribution
            JobApplication.aggregate([
                {
                    $group: {
                        _id: '$status',
                        value: { $sum: 1 },
                    },
                }
            ]),
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const applicationStats = applicationTrends.map(item => ({
            name: months[item._id - 1],
            count: item.count
        }));

        const placementStats = placementDist.map(item => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.value
        }));

        return {
            totalUsers,
            totalStudents,
            totalAdmins: totalUsers - totalStudents,
            totalCourses,
            totalSessions,
            totalAssessments,
            totalJobs,
            totalApplications,
            averageProgress: averageProgress[0]?.avg || 0,
            recentSignups,
            applicationStats: applicationStats.length > 0 ? applicationStats : [
                { name: 'Jan', count: 0 },
                { name: 'Feb', count: 0 },
            ],
            placementStats: placementStats.length > 0 ? placementStats : [
                { name: 'Applied', value: 0 },
            ],
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
