import api from './api';
import { Assessment, AssessmentResult } from '../types';

export const assessmentService = {
    async listAssessments(page = 1, limit = 10, status?: string) {
        const params: Record<string, string | number> = { page, limit };
        if (status) params.status = status;
        const { data } = await api.get('/assessments', { params });
        return data.data as { assessments: Assessment[]; total: number; page: number; totalPages: number };
    },

    async getAssessmentById(id: string) {
        const { data } = await api.get(`/assessments/${id}`);
        return data.data as { assessment: Assessment; result: AssessmentResult | null };
    },

    async createAssessment(assessmentData: Partial<Assessment>) {
        const { data } = await api.post('/assessments', assessmentData);
        return data.data.assessment as Assessment;
    },

    async updateAssessment(id: string, assessmentData: Partial<Assessment>) {
        const { data } = await api.put(`/assessments/${id}`, assessmentData);
        return data.data.assessment as Assessment;
    },

    async deleteAssessment(id: string) {
        await api.delete(`/assessments/${id}`);
    },

    async submitAssessment(id: string, answers: number[]) {
        const { data } = await api.post(`/assessments/${id}/submit`, { answers });
        return data.data.result as AssessmentResult;
    },

    async getResult(id: string) {
        const { data } = await api.get(`/assessments/${id}/result`);
        return data.data.result as AssessmentResult;
    },
};
