import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';
import { ApiError } from '../utils/ApiError';

/**
 * Role-based access control middleware factory.
 *
 * Usage:
 *   router.get('/admin/users', authenticate, authorize(UserRole.ADMIN), controller);
 *   router.get('/profile', authenticate, authorize(UserRole.STUDENT, UserRole.ADMIN), controller);
 *
 * Must be used AFTER the `authenticate` middleware (which sets req.user).
 */
export const authorize = (...allowedRoles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!(req as any).user) {
            return next(ApiError.unauthorized('Authentication required'));
        }

        if (!allowedRoles.includes((req as any).user.role as UserRole)) {
            return next(
                ApiError.forbidden(
                    `Access denied. Required role(s): ${allowedRoles.join(', ')}`,
                ),
            );
        }

        next();
    };
};
