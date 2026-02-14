import { Response } from 'express';
import { ApiResponseType } from '../types';

/**
 * Standardized API response helper.
 * Ensures every response follows the same { success, message, data } shape.
 */
export class ApiResponse {
    /**
     * Send a success response.
     */
    static success<T>(res: Response, data?: T, message = 'Success', statusCode = 200): Response {
        const body: ApiResponseType<T> = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(body);
    }

    /**
     * Send a created (201) response.
     */
    static created<T>(res: Response, data?: T, message = 'Created successfully'): Response {
        return ApiResponse.success(res, data, message, 201);
    }

    /**
     * Send an error response.
     */
    static error(
        res: Response,
        message = 'Something went wrong',
        statusCode = 500,
        errors: Record<string, string[]> = {},
    ): Response {
        const body: ApiResponseType = {
            success: false,
            message,
            errors: Object.keys(errors).length > 0 ? errors : undefined,
        };
        return res.status(statusCode).json(body);
    }
}
