import api from './api';
import { Resource, ResourceType } from '../types';

export const resourceService = {
    async listResources(page = 1, limit = 10, type?: ResourceType, search?: string) {
        const params: Record<string, string | number> = { page, limit };
        if (type) params.type = type;
        if (search) params.search = search;
        const { data } = await api.get('/resources', { params });
        return data.data as { resources: Resource[]; total: number; page: number; totalPages: number };
    },

    async getResourceById(id: string) {
        const { data } = await api.get(`/resources/${id}`);
        return data.data.resource as Resource;
    },

    async createResource(resourceData: Partial<Resource>) {
        const { data } = await api.post('/resources', resourceData);
        return data.data.resource as Resource;
    },

    async updateResource(id: string, resourceData: Partial<Resource>) {
        const { data } = await api.put(`/resources/${id}`, resourceData);
        return data.data.resource as Resource;
    },

    async deleteResource(id: string) {
        await api.delete(`/resources/${id}`);
    },
};
