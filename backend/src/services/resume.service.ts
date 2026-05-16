const pdf = require('pdf-parse');
import { ApiError } from '../utils/ApiError';

/**
 * Resume Service — handles PDF parsing and text extraction.
 */
export class ResumeService {
    /**
     * Parse a PDF buffer and extract raw text.
     */
    static async parseResume(buffer: Buffer): Promise<string> {
        try {
            const data = await pdf(buffer);
            return data.text.trim();
        } catch (error) {
            console.error('Error parsing PDF:', error);
            throw ApiError.badRequest('Failed to parse resume PDF. Please ensure it is a valid PDF file.');
        }
    }
}
