import { Resource, IResourceDocument, ResourceType } from '../models/resource.model';
import { ApiError } from '../utils/ApiError';

/**
 * Resource Service — CRUD + search.
 */
export class ResourceService {
    static async listResources(page: number, limit: number, type?: ResourceType, search?: string) {
        const filter: Record<string, unknown> = { isPublished: true };
        if (type) filter.type = type;
        if (search) filter.$text = { $search: search };

        const [resources, total] = await Promise.all([
            Resource.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Resource.countDocuments(filter),
        ]);

        return { resources, total, page, totalPages: Math.ceil(total / limit) };
    }

    static async getResourceById(resourceId: string) {
        const resource = await Resource.findById(resourceId);
        if (!resource) throw ApiError.notFound('Resource not found');
        return resource.toJSON();
    }

    static async createResource(data: Partial<IResourceDocument>, createdBy: string) {
        const resource = await Resource.create({ ...data, createdBy });
        return resource.toJSON();
    }

    static async updateResource(resourceId: string, data: Partial<IResourceDocument>) {
        const resource = await Resource.findByIdAndUpdate(resourceId, data, { new: true, runValidators: true });
        if (!resource) throw ApiError.notFound('Resource not found');
        return resource.toJSON();
    }

    static async deleteResource(resourceId: string) {
        const result = await Resource.findByIdAndDelete(resourceId);
        if (!result) throw ApiError.notFound('Resource not found');
    }
}
