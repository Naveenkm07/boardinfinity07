import { User, IUserDocument } from '../models/user.model';
import { UserRole } from '../types';
import { ApiError } from '../utils/ApiError';

/**
 * User Service — handles user CRUD operations.
 */
export class UserService {
    /**
     * Get a user by ID.
     */
    static async getUserById(userId: string): Promise<IUserDocument> {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.notFound('User not found');
        }
        return user;
    }

    /**
     * Update a user's profile.
     */
    static async updateProfile(
        userId: string,
        updates: Partial<
            Pick<
                IUserDocument,
                | 'name'
                | 'department'
                | 'rollNumber'
                | 'phone'
                | 'profileImage'
                | 'summary'
                | 'skills'
                | 'socialLinks'
                | 'experience'
                | 'education'
                | 'resumeUrl'
            >
        >,
    ): Promise<IUserDocument> {
        const user = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        return user;
    }

    /**
     * List users with pagination and optional role filter.
     * Admin-only operation.
     */
    static async listUsers(
        page: number,
        limit: number,
        role?: UserRole,
    ): Promise<{
        users: IUserDocument[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const filter = role ? { role } : {};
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            User.countDocuments(filter),
        ]);

        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Delete a user by ID. Admin-only operation.
     */
    static async deleteUser(userId: string): Promise<void> {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            throw ApiError.notFound('User not found');
        }
    }

    /**
     * Add points to a user.
     */
    static async addPoints(userId: string, points: number, badgeName?: string): Promise<IUserDocument> {
        const user = await User.findById(userId);
        if (!user) throw ApiError.notFound('User not found');
        
        user.points += points;
        if (badgeName) {
            const hasBadge = user.badges.some(b => b.name === badgeName);
            if (!hasBadge) {
                user.badges.push({ name: badgeName, icon: '🏆', earnedAt: new Date() });
            }
        }
        
        return user.save();
    }

    /**
     * Get leaderboard.
     */
    static async getLeaderboard(limit: number = 10): Promise<IUserDocument[]> {
        return User.find({ role: UserRole.STUDENT })
            .sort({ points: -1 })
            .limit(limit)
            .select('name points department badges');
    }
}
