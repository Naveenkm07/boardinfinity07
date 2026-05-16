import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types';

const router = Router();

/**
 * User Routes — all require authentication.
 *
 * GET    /api/users/profile   — Get own profile (any authenticated user)
 * PATCH  /api/users/profile   — Update own profile (any authenticated user)
 * GET    /api/users            — List all users (admin only)
 * DELETE /api/users/:id        — Delete a user (admin only)
 */

// Profile routes (any authenticated user)
router.get('/profile', authenticate, UserController.getProfile);
router.patch('/profile', authenticate, UserController.updateProfile);

// Admin-only routes
router.get('/', authenticate, authorize(UserRole.ADMIN), UserController.listUsers);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), UserController.deleteUser);

export default router;
