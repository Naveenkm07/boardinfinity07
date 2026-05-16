import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../validators/user.validator';
import { uploadResume } from '../middleware/upload.middleware';
import { UserRole } from '../types';

const router = Router();

/**
 * User Routes
 */

// Public routes
router.get('/portfolio/:username', UserController.getPublicPortfolio);

// Protected routes (require authentication)
router.use(authenticate);

router.get('/profile', UserController.getProfile);
router.patch('/profile', validate(updateProfileSchema), UserController.updateProfile);

// Resume upload and scoring
router.post('/resume', uploadResume.single('resume'), UserController.uploadResume);
router.post('/score-resume', UserController.scoreResume);

// GitHub sync
router.post('/sync-github', UserController.syncGithub);

// Leaderboard
router.get('/leaderboard', UserController.getLeaderboard);

// Admin-only routes
router.get('/', authorize(UserRole.ADMIN), UserController.listUsers);
router.delete('/:id', authorize(UserRole.ADMIN), UserController.deleteUser);

export default router;
