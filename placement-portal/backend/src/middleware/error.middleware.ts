import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { env } from '../config/env';

/**
 * Global error handling middleware.
 *
 * This MUST be the last middleware registered on the Express app.
 * It catches all errors thrown by route handlers and other middleware.
 *
 * Design:
 * - Operational errors (ApiError): Return structured JSON with appropriate status code
 * - Programming errors: Log full stack trace, return generic 500 to client
 * - Mongoose validation errors: Format as 400 Bad Request
 * - Mongoose duplicate key errors: Format as 409 Conflict
 */
export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    // Default error values
    let statusCode = 500;
    let message = 'Internal server error';
    let errors: Record<string, string[]> = {};

    // Known operational error
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }
    // Mongoose validation error
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mongooseErr = err as any;
        if (mongooseErr.errors) {
            for (const [field, error] of Object.entries(mongooseErr.errors)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                errors[field] = [(error as any).message];
            }
        }
    }
    // Mongoose duplicate key error
    else if (err.name === 'MongoServerError' && (err as Record<string, unknown>).code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry — resource already exists';
    }
    // Mongoose cast error (invalid ObjectId, etc.)
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid resource identifier';
    }

    // Log error details
    if (statusCode >= 500) {
        logger.error(`[${statusCode}] ${message}`, {
            stack: err.stack,
            name: err.name,
        });
    } else {
        logger.warn(`[${statusCode}] ${message}`);
    }

    // Send response — hide internal details in production
    res.status(statusCode).json({
        success: false,
        message,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
