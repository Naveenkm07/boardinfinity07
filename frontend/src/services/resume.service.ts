import api from './api';
import { ApiResponse } from '../types';

export const resumeService = {
    /**
     * Parse a PDF resume and return extracted text.
     */
    parseResume: async (file: File): Promise<ApiResponse<{ text: string }>> => {
        const formData = new FormData();
        formData.append('resume', file);
        
        const { data } = await api.post<ApiResponse<{ text: string }>>('/resume/parse', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    /**
     * Score a resume against a job description.
     */
    scoreResume: async (file: File, jobDescription: string): Promise<ApiResponse<{
        score: number;
        matchedSkills: string[];
        missingSkills: string[];
        feedback: string;
    }>> => {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);
        
        const { data } = await api.post<ApiResponse<{
            score: number;
            matchedSkills: string[];
            missingSkills: string[];
            feedback: string;
        }>>('/resume/score', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    /**
     * Upload resume for profile parsing.
     */
    uploadToProfile: async (file: File): Promise<ApiResponse<{ text: string }>> => {
        const formData = new FormData();
        formData.append('resume', file);
        
        const { data } = await api.post<ApiResponse<{ text: string }>>('/resume/upload-to-profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },
};
