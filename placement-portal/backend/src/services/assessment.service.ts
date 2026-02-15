import { Assessment, AssessmentResult, IAssessmentDocument } from '../models/assessment.model';
import { ApiError } from '../utils/ApiError';

/**
 * Assessment Service — CRUD + submission + grading.
 */
export class AssessmentService {
    static async listAssessments(page: number, limit: number, status?: string) {
        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;

        const [assessments, total] = await Promise.all([
            Assessment.find(filter)
                .select('-questions.correctAnswer') // Hide answers in listings
                .sort({ dueDate: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Assessment.countDocuments(filter),
        ]);

        return { assessments, total, page, totalPages: Math.ceil(total / limit) };
    }

    static async getAssessmentById(assessmentId: string, userId?: string) {
        const assessment = await Assessment.findById(assessmentId).select('-questions.correctAnswer');
        if (!assessment) throw ApiError.notFound('Assessment not found');

        let result = null;
        if (userId) {
            result = await AssessmentResult.findOne({ userId, assessmentId }).lean();
        }

        return { assessment: assessment.toJSON(), result };
    }

    static async createAssessment(data: Partial<IAssessmentDocument>, createdBy: string) {
        // Auto-calculate total points
        const totalPoints = (data.questions || []).reduce((sum, q) => sum + (q.points || 1), 0);
        const assessment = await Assessment.create({ ...data, totalPoints, createdBy });
        return assessment.toJSON();
    }

    static async updateAssessment(assessmentId: string, data: Partial<IAssessmentDocument>) {
        if (data.questions) {
            (data as any).totalPoints = data.questions.reduce((sum, q) => sum + (q.points || 1), 0);
        }
        const assessment = await Assessment.findByIdAndUpdate(assessmentId, data, { new: true, runValidators: true });
        if (!assessment) throw ApiError.notFound('Assessment not found');
        return assessment.toJSON();
    }

    static async deleteAssessment(assessmentId: string) {
        const result = await Assessment.findByIdAndDelete(assessmentId);
        if (!result) throw ApiError.notFound('Assessment not found');
        await AssessmentResult.deleteMany({ assessmentId });
    }

    /**
     * Submit answers and auto-grade.
     */
    static async submitAssessment(assessmentId: string, userId: string, answers: number[]) {
        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) throw ApiError.notFound('Assessment not found');
        if (assessment.status !== 'active') throw ApiError.badRequest('Assessment is not active');
        if (new Date() > assessment.dueDate) throw ApiError.badRequest('Assessment has expired');

        const existing = await AssessmentResult.findOne({ userId, assessmentId });
        if (existing) throw ApiError.badRequest('Already submitted this assessment');

        if (answers.length !== assessment.questions.length) {
            throw ApiError.badRequest('Answer count does not match question count');
        }

        // Auto-grade
        let score = 0;
        assessment.questions.forEach((q, i) => {
            if (q.correctAnswer === answers[i]) {
                score += q.points;
            }
        });

        const result = await AssessmentResult.create({
            userId,
            assessmentId,
            answers,
            score,
            totalPoints: assessment.totalPoints,
            percentage: Math.round((score / assessment.totalPoints) * 100),
        });

        return result.toJSON();
    }

    static async getResult(assessmentId: string, userId: string) {
        const result = await AssessmentResult.findOne({ userId, assessmentId })
            .populate('assessmentId', 'title description duration');
        if (!result) throw ApiError.notFound('No submission found for this assessment');
        return result.toJSON();
    }
}
