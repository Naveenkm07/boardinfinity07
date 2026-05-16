import { Experience, IExperienceDocument } from '../models/experience.model';
import { ApiError } from '../utils/ApiError';

export class ExperienceService {
    static async createExperience(data: Partial<IExperienceDocument>): Promise<IExperienceDocument> {
        return Experience.create(data);
    }

    static async listExperiences(page: number, limit: number, filters: any = {}): Promise<{ experiences: IExperienceDocument[]; total: number }> {
        const skip = (page - 1) * limit;
        const [experiences, total] = await Promise.all([
            Experience.find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'name department'),
            Experience.countDocuments(filters),
        ]);
        return { experiences, total };
    }

    static async getExperienceById(id: string): Promise<IExperienceDocument> {
        const experience = await Experience.findById(id).populate('author', 'name department').populate('comments.userId', 'name');
        if (!experience) {
            throw ApiError.notFound('Experience post not found');
        }
        return experience;
    }

    static async updateExperience(id: string, userId: string, data: Partial<IExperienceDocument>): Promise<IExperienceDocument> {
        const experience = await Experience.findOne({ _id: id, author: userId });
        if (!experience) {
            throw ApiError.notFound('Experience post not found or you are not the author');
        }
        Object.assign(experience, data);
        return experience.save();
    }

    static async deleteExperience(id: string, userId: string): Promise<void> {
        const result = await Experience.deleteOne({ _id: id, author: userId });
        if (result.deletedCount === 0) {
            throw ApiError.notFound('Experience post not found or you are not the author');
        }
    }

    static async upvoteExperience(id: string, userId: string): Promise<IExperienceDocument> {
        const experience = await Experience.findById(id);
        if (!experience) {
            throw ApiError.notFound('Experience post not found');
        }

        const index = experience.upvotes.indexOf(userId as any);
        if (index === -1) {
            experience.upvotes.push(userId as any);
        } else {
            experience.upvotes.splice(index, 1);
        }

        return experience.save();
    }

    static async addComment(id: string, userId: string, content: string): Promise<IExperienceDocument> {
        const experience = await Experience.findById(id);
        if (!experience) {
            throw ApiError.notFound('Experience post not found');
        }
        experience.comments.push({ userId: userId as any, content, createdAt: new Date() });
        return experience.save();
    }
}
