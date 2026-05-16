import { User } from '../models/user.model';
import { Job } from '../models/job.model';
import { AiService } from './ai.service';
import { ApiError } from '../utils/ApiError';

export class AnalysisService {
    /**
     * Analyze a student's skills against job market requirements.
     */
    static async getSkillGapAnalysis(userId: string) {
        const user = await User.findById(userId);
        if (!user) throw ApiError.notFound('User not found');

        const studentSkills = user.skills || [];
        
        // Get trending jobs or jobs related to student's department
        const trendingJobs = await Job.find({ status: 'open' })
            .sort({ createdAt: -1 })
            .limit(10);

        const marketSkills = new Set<string>();
        trendingJobs.forEach(job => {
            job.skills.forEach(skill => marketSkills.add(skill.toLowerCase()));
        });

        const missingSkills = Array.from(marketSkills).filter(
            skill => !studentSkills.some(ss => ss.toLowerCase() === skill)
        );

        // Use AI to generate a personalized learning path
        const learningPath = await AiService.generateLearningPath(studentSkills, missingSkills);

        return {
            currentSkills: studentSkills,
            missingSkills: missingSkills.slice(0, 10), // Top 10 missing
            marketTrends: Array.from(marketSkills).slice(0, 15),
            learningPath,
        };
    }
}
