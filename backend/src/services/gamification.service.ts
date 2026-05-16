import { User } from '../models/user.model';

export enum GamificationAction {
    SUBMIT_CODE = 'SUBMIT_CODE',
    COMPLETE_INTERVIEW = 'COMPLETE_INTERVIEW',
    UPLOAD_RESUME = 'UPLOAD_RESUME',
    SYNC_GITHUB = 'SYNC_GITHUB',
    PROFILE_COMPLETE = 'PROFILE_PROFILE',
    APPLY_JOB = 'APPLY_JOB',
}

const POINTS_CONFIG: Record<GamificationAction, number> = {
    [GamificationAction.SUBMIT_CODE]: 10,
    [GamificationAction.COMPLETE_INTERVIEW]: 20,
    [GamificationAction.UPLOAD_RESUME]: 30,
    [GamificationAction.SYNC_GITHUB]: 50,
    [GamificationAction.PROFILE_COMPLETE]: 25,
    [GamificationAction.APPLY_JOB]: 15,
};

/**
 * Gamification Service — handles points and badges.
 */
export class GamificationService {
    /**
     * Award points to a user for a specific action and check for badges.
     */
    static async awardPoints(userId: string, action: GamificationAction) {
        const points = POINTS_CONFIG[action];
        const user = await User.findByIdAndUpdate(userId, { $inc: { points } }, { new: true });
        
        if (!user) return points;

        // Badge Check Logic
        const newBadges: { name: string; icon: string }[] = [];

        // 1. Point-based badges
        if (user.points >= 100 && !user.badges.some(b => b.name === 'Rising Star')) {
            newBadges.push({ name: 'Rising Star', icon: '⭐' });
        }
        if (user.points >= 500 && !user.badges.some(b => b.name === 'Elite Achiever')) {
            newBadges.push({ name: 'Elite Achiever', icon: '🎖️' });
        }

        // 2. Action-specific badges
        if (action === GamificationAction.COMPLETE_INTERVIEW && !user.badges.some(b => b.name === 'Ready for HR')) {
            newBadges.push({ name: 'Ready for HR', icon: '👔' });
        }
        if (action === GamificationAction.SYNC_GITHUB && !user.badges.some(b => b.name === 'Open Sourcer')) {
            newBadges.push({ name: 'Open Sourcer', icon: '🐙' });
        }

        if (newBadges.length > 0) {
            await User.findByIdAndUpdate(userId, {
                $push: { badges: { $each: newBadges.map(b => ({ ...b, earnedAt: new Date() })) } }
            });
        }

        return points;
    }

    /**
     * Get the leaderboard (top users by points).
     */
    static async getLeaderboard(limit = 10) {
        return User.find({ role: 'student' })
            .sort({ points: -1 })
            .limit(limit)
            .select('name username department points badges profileImage');
    }
}
