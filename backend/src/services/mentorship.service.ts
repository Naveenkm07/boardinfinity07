import { Mentorship, IMentorshipDocument } from '../models/mentorship.model';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { NotificationService } from './notification.service';

export class MentorshipService {
    static async listAlumni(): Promise<any[]> {
        return User.find({ isAlumni: true }).select('name department profileImage skills socialLinks experience');
    }

    static async bookSession(data: Partial<IMentorshipDocument>): Promise<IMentorshipDocument> {
        const mentor = await User.findById(data.mentorId);
        if (!mentor || !mentor.isAlumni) {
            throw ApiError.badRequest('Selected user is not an alumni mentor');
        }

        const session = await Mentorship.create(data);

        await NotificationService.createAndSend({
            userId: mentor._id.toString(),
            title: 'New Mentorship Request',
            message: `A student has requested a mentorship session on topic: ${session.topic}`,
            type: 'info',
            link: '/mentor-sessions'
        });

        return session;
    }

    static async getStudentSessions(studentId: string): Promise<IMentorshipDocument[]> {
        return Mentorship.find({ studentId }).populate('mentorId', 'name department').sort({ dateTime: 1 });
    }

    static async getMentorSessions(mentorId: string): Promise<IMentorshipDocument[]> {
        return Mentorship.find({ mentorId }).populate('studentId', 'name department').sort({ dateTime: 1 });
    }

    static async updateSessionStatus(id: string, userId: string, status: string): Promise<IMentorshipDocument> {
        const session = await Mentorship.findById(id);
        if (!session) throw ApiError.notFound('Session not found');

        if (session.mentorId.toString() !== userId && session.studentId.toString() !== userId) {
            throw ApiError.forbidden('Unauthorized');
        }

        session.status = status as any;
        await session.save();

        if (session.mentorId.toString() === userId) {
            await NotificationService.createAndSend({
                userId: session.studentId.toString(),
                title: 'Mentorship Session Updated',
                message: `Your session on ${session.topic} is now ${status}.`,
                type: status === 'confirmed' ? 'success' : 'warning',
                link: '/student/mentorship'
            });
        }

        return session;
    }
}
