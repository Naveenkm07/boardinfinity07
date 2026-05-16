import api from './api';
import { ApiResponse } from '@/types';

export interface SkillGapAnalysis {
    currentSkills: string[];
    missingSkills: string[];
    marketTrends: string[];
    learningPath: string;
}

export const analysisService = {
    /**
     * Get a personalized skill gap analysis.
     */
    getSkillGapAnalysis: async (): Promise<ApiResponse<SkillGapAnalysis>> => {
        const { data } = await api.get<ApiResponse<SkillGapAnalysis>>('/analysis/skill-gap');
        return data;
    },
};
