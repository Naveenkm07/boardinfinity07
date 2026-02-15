import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types';
import { ApiError } from '../utils/ApiError';

/**
 * JWT Authentication Middleware.
 *
 * Flow:
 * 1. Extract token from `Authorization: Bearer <token>` header
 * 2. Verify the token signature and expiration
 * 3. Attach decoded payload to `req.user`
 * 4. Call next() to proceed to the route handler
 *
 * If token is missing or invalid, throw 401 Unauthorized.
 */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('Access token is missing or malformed');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw ApiError.unauthorized('Access token is missing');
        }

        // Verify token and decode payload
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

        // Attach user info to request for downstream handlers
        (req as any).user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(ApiError.unauthorized('Invalid or expired token'));
        } else if (error instanceof jwt.TokenExpiredError) {
            next(ApiError.unauthorized('Token has expired'));
        } else {
            next(error);
        }
    }
};
