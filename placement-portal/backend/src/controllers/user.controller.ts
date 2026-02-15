import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/ApiResponse';
import { UserRole, AuthRequest } from '../types';
import { CONSTANTS } from '../utils/constants';

/**
 * User Controller.
 * Handles user profile management and admin user listing.
 */
export class UserController {
    /**
     * GET /api/users/profile
     * Get the authenticated user's profile.
     */
    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await UserService.getUserById((req as AuthRequest).user!.userId);
            ApiResponse.success(res, { user: user.toJSON() }, 'Profile retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/users/profile
     * Update the authenticated user's profile.
     */
    static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, department, rollNumber, phone } = req.body;
            const user = await UserService.updateProfile((req as AuthRequest).user!.userId, {
                name,
                department,
                rollNumber,
                phone,
            });
            ApiResponse.success(res, { user: user.toJSON() }, 'Profile updated');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/users
     * List all users (admin only). Supports pagination and role filtering.
     *
     * Query params:
     *   - page (default: 1)
     *   - limit (default: 20, max: 100)
     *   - role (optional: 'student' | 'admin')
     */
    static async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = Math.max(1, parseInt(req.query.page as string) || CONSTANTS.DEFAULT_PAGE);
            const limit = Math.min(
                CONSTANTS.MAX_LIMIT,
                Math.max(1, parseInt(req.query.limit as string) || CONSTANTS.DEFAULT_LIMIT),
            );
            const role = req.query.role as UserRole | undefined;

            const result = await UserService.listUsers(page, limit, role);
            ApiResponse.success(res, result, 'Users retrieved');
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/users/:id
     * Delete a user (admin only).
     */
    static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await UserService.deleteUser(req.params.id as string);
            ApiResponse.success(res, null, 'User deleted');
        } catch (error) {
            next(error);
        }
    }
}
