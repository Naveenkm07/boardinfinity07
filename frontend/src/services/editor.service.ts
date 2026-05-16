import api from './api';
import { CodeExecutionResult, TestCase } from '../types';

export const editorService = {
    async runCode(code: string, language: string, testCases: TestCase[]): Promise<CodeExecutionResult> {
        const { data } = await api.post('/editor/run', { code, language, testCases });
        return data.data;
    },

    async saveCode(code: string, language: string, title?: string) {
        const { data } = await api.post('/editor/save', { code, language, title });
        return data.data;
    },

    async getSubmissions() {
        const { data } = await api.get('/editor/submissions');
        return data.data.submissions;
    },
};
