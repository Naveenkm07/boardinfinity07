/**
 * Custom API Error class for operational errors.
 * These are errors we can anticipate (validation failures, auth errors, etc.)
 * as opposed to programming bugs which crash the process.
 */
export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errors: Record<string, string[]>;

    constructor(
        statusCode: number,
        message: string,
        errors: Record<string, string[]> = {},
        isOperational = true,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;

        // Maintain proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, ApiError.prototype);

        // Capture stack trace (excludes constructor call from trace)
        Error.captureStackTrace(this, this.constructor);
    }

    /** 400 Bad Request */
    static badRequest(message: string, errors: Record<string, string[]> = {}) {
        return new ApiError(400, message, errors);
    }

    /** 401 Unauthorized */
    static unauthorized(message = 'Unauthorized') {
        return new ApiError(401, message);
    }

    /** 403 Forbidden */
    static forbidden(message = 'Forbidden') {
        return new ApiError(403, message);
    }

    /** 404 Not Found */
    static notFound(message = 'Resource not found') {
        return new ApiError(404, message);
    }

    /** 429 Too Many Requests */
    static tooManyRequests(message = 'Too many requests, please try again later') {
        return new ApiError(429, message);
    }

    /** 500 Internal Server Error */
    static internal(message = 'Internal server error') {
        return new ApiError(500, message, {}, false);
    }
}
