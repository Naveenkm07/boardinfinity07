import { Session, ISessionDocument, SessionStatus } from '../models/session.model';
import { ApiError } from '../utils/ApiError';

/**
 * Session Service — CRUD + attendance.
 */
export class SessionService {
    static async listSessions(page: number, limit: number, status?: SessionStatus) {
        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;

        const [sessions, total] = await Promise.all([
            Session.find(filter).sort({ scheduledAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Session.countDocuments(filter),
        ]);

        return { sessions, total, page, totalPages: Math.ceil(total / limit) };
    }

    static async getSessionById(sessionId: string) {
        const session = await Session.findById(sessionId).populate('attendees', 'name email');
        if (!session) throw ApiError.notFound('Session not found');
        return session.toJSON();
    }

    static async createSession(data: Partial<ISessionDocument>, createdBy: string) {
        const session = await Session.create({ ...data, createdBy });
        return session.toJSON();
    }

    static async updateSession(sessionId: string, data: Partial<ISessionDocument>) {
        const session = await Session.findByIdAndUpdate(sessionId, data, { new: true, runValidators: true });
        if (!session) throw ApiError.notFound('Session not found');
        return session.toJSON();
    }

    static async deleteSession(sessionId: string) {
        const result = await Session.findByIdAndDelete(sessionId);
        if (!result) throw ApiError.notFound('Session not found');
    }

    static async attendSession(sessionId: string, userId: string) {
        const session = await Session.findById(sessionId);
        if (!session) throw ApiError.notFound('Session not found');
        if (session.status !== 'upcoming') throw ApiError.badRequest('Session is not upcoming');
        if (session.attendees.length >= session.maxAttendees) throw ApiError.badRequest('Session is full');

        const alreadyAttending = session.attendees.some((id) => id.toString() === userId);
        if (alreadyAttending) throw ApiError.badRequest('Already registered for this session');

        session.attendees.push(userId as any);
        await session.save();
        return session.toJSON();
    }
}
