import { Competition, ICompetitionDocument, CompetitionStatus } from '../models/competition.model';
import { ApiError } from '../utils/ApiError';

/**
 * Competition Service — CRUD + registration.
 */
export class CompetitionService {
    static async listCompetitions(
        page: number,
        limit: number,
        status?: CompetitionStatus,
        difficulty?: string,
    ) {
        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;
        if (difficulty) filter.difficulty = difficulty;

        const [competitions, total] = await Promise.all([
            Competition.find(filter).sort({ startDate: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Competition.countDocuments(filter),
        ]);

        return { competitions, total, page, totalPages: Math.ceil(total / limit) };
    }

    static async getCompetitionById(competitionId: string) {
        const competition = await Competition.findById(competitionId);
        if (!competition) throw ApiError.notFound('Competition not found');
        return competition.toJSON();
    }

    static async createCompetition(data: Partial<ICompetitionDocument>, createdBy: string) {
        const competition = await Competition.create({ ...data, createdBy });
        return competition.toJSON();
    }

    static async updateCompetition(competitionId: string, data: Partial<ICompetitionDocument>) {
        const comp = await Competition.findByIdAndUpdate(competitionId, data, { new: true, runValidators: true });
        if (!comp) throw ApiError.notFound('Competition not found');
        return comp.toJSON();
    }

    static async deleteCompetition(competitionId: string) {
        const result = await Competition.findByIdAndDelete(competitionId);
        if (!result) throw ApiError.notFound('Competition not found');
    }

    static async registerForCompetition(competitionId: string, userId: string) {
        const comp = await Competition.findById(competitionId);
        if (!comp) throw ApiError.notFound('Competition not found');
        if (comp.status === 'ended') throw ApiError.badRequest('Competition has ended');
        if (comp.participants.length >= comp.maxParticipants) throw ApiError.badRequest('Competition is full');

        const alreadyRegistered = comp.participants.some((id) => id.toString() === userId);
        if (alreadyRegistered) throw ApiError.badRequest('Already registered');

        comp.participants.push(userId as any);
        await comp.save();
        return comp.toJSON();
    }
}
