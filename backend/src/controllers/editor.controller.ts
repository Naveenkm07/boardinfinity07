import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';
import { GamificationService, GamificationAction } from '../services/gamification.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_CONFIG: Record<string, { language: string; version: string }> = {
    javascript: { language: 'javascript', version: '18.15.0' },
    python: { language: 'python', version: '3.10.0' },
    java: { language: 'java', version: '15.0.2' },
    cpp: { language: 'cpp', version: '10.2.0' },
};

/**
 * Editor Controller — handles code execution and saving.
 */
export class EditorController {
    /**
     * POST /api/editor/run
     * Execute code against test cases using Piston API.
     */
    static async runCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, language, testCases } = req.body;

            if (!code || !language) {
                res.status(400).json({ success: false, message: 'Code and language are required' });
                return;
            }

            const config = LANGUAGE_CONFIG[language];
            if (!config) {
                res.status(400).json({ success: false, message: `Unsupported language: ${language}` });
                return;
            }

            const results = [];
            let totalPassed = 0;

            for (let i = 0; i < (testCases || []).length; i++) {
                const tc = testCases[i];
                
                const response = await fetch(PISTON_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: config.language,
                        version: config.version,
                        files: [{ content: code }],
                        stdin: tc.input,
                    }),
                });

                const data = await response.json() as any;
                
                const actual = data.run?.stdout?.trim() || data.run?.stderr?.trim() || '';
                const passed = actual === tc.expected?.trim();
                
                if (passed) totalPassed++;

                results.push({
                    testCase: i + 1,
                    input: tc.input,
                    expected: tc.expected,
                    actual: actual,
                    passed: passed,
                    executionTime: data.run?.time || 0,
                    error: data.run?.stderr || null,
                });
            }

            // Award points if all tests passed
            if (totalPassed === (testCases || []).length && (testCases || []).length > 0) {
                const userId = (req as AuthRequest).user!.userId;
                await GamificationService.awardPoints(userId, GamificationAction.SUBMIT_CODE);
            }

            ApiResponse.success(
                res,
                {
                    language,
                    results,
                    totalPassed,
                    totalTests: results.length,
                    executionTime: results.reduce((s: number, r: any) => s + (r.executionTime * 1000), 0),
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
            ApiResponse.success(res, { submissions: [] }, 'Submissions retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/editor/hint
     * Get AI hint for current code.
     */
    static async getHint(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, language, problemStatement } = req.body;

            if (!code || !language) {
                res.status(400).json({ success: false, message: 'Code and language are required' });
                return;
            }

            const hint = await AIService.getCodingHint(code, language, problemStatement || 'A coding problem');

            ApiResponse.success(res, { hint }, 'Hint generated successfully');
        } catch (error) {
            next(error);
        }
    }
}
