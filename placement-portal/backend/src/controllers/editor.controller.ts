import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

/**
 * Editor Controller — handles code execution and saving.
 * NOTE: For production, integrate with a sandboxed code execution service
 * (e.g., Judge0, Sphere Engine). This provides a mock execution for MVP.
 */
export class EditorController {
    /**
     * POST /api/editor/run
     * Execute code against test cases (mock execution for MVP).
     */
    static async runCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, language, testCases } = req.body;

            if (!code || !language) {
                res.status(400).json({ success: false, message: 'Code and language are required' });
                return;
            }

            // Mock execution results for MVP
            // In production, send to Judge0 / sandboxed executor
            const results = (testCases || []).map((tc: { input: string; expected: string }, i: number) => ({
                testCase: i + 1,
                input: tc.input,
                expected: tc.expected,
                actual: tc.expected, // Mock: always passes
                passed: true,
                executionTime: Math.floor(Math.random() * 100) + 10,
            }));

            ApiResponse.success(
                res,
                {
                    language,
                    results,
                    totalPassed: results.length,
                    totalTests: results.length,
                    executionTime: results.reduce((s: number, r: any) => s + r.executionTime, 0),
                },
                'Code executed successfully',
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/editor/save
     * Save code snippet for a user.
     */
    static async saveCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, language, title } = req.body;
            const userId = (req as AuthRequest).user!.userId;

            // For MVP, return a mock saved response
            // In production, save to a CodeSnippet model
            ApiResponse.success(
                res,
                {
                    id: `snippet_${Date.now()}`,
                    userId,
                    title: title || 'Untitled',
                    language,
                    code,
                    savedAt: new Date().toISOString(),
                },
                'Code saved successfully',
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/editor/submissions
     * Get user's saved code submissions.
     */
    static async getSubmissions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Mock data for MVP
            ApiResponse.success(res, { submissions: [] }, 'Submissions retrieved');
        } catch (error) {
            next(error);
        }
    }
}
