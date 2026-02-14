import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Request validation middleware factory using Zod schemas.
 *
 * Usage:
 *   router.post('/send-otp', validate(sendOtpSchema), authController.sendOtp);
 *
 * Validates req.body, req.query, and req.params against the provided schema.
 */
export const validate = (schema: AnyZodObject) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors: Record<string, string[]> = {};

                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    if (!fieldErrors[path]) {
                        fieldErrors[path] = [];
                    }
                    fieldErrors[path].push(err.message);
                });

                next(ApiError.badRequest('Validation failed', fieldErrors));
            } else {
                next(error);
            }
        }
    };
};
