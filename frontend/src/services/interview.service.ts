import api from './api';
import { ApiResponse } from '@/types';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

export interface Interview {
    id: string;
    studentId: string;
    type: 'technical' | 'hr' | 'behavioral';
    topic?: string;
    status: 'active' | 'completed';
    messages: Message[];
    feedback?: string;
    score?: number;
    createdAt: string;
}

export const interviewService = {
    startInterview: async (type: string, topic: string): Promise<ApiResponse<{ interview: Interview }>> => {
        const { data } = await api.post('/interview/start', { type, topic });
        return data;
    },

    sendMessage: async (id: string, content: string): Promise<ApiResponse<{ 
        response: string; 
        status: string;
        feedback?: string;
        score?: number;
    }>> => {
        const { data } = await api.post(`/interview/${id}/message`, { content });
        return data;
    },

    getMyInterviews: async (): Promise<ApiResponse<{ interviews: Interview[] }>> => {
        const { data } = await api.get('/interview/me');
        return data;
    },

    getInterviewById: async (id: string): Promise<ApiResponse<{ interview: Interview }>> => {
        const { data } = await api.get(`/interview/${id}`);
        return data;
    },
};
