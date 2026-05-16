import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize(UserRole.ADMIN));

router.get('/analytics', AdminController.getAnalytics);
router.get('/users', AdminController.listUsers);
router.patch('/users/:id', AdminController.updateUserRole);
router.get('/assessments/:id/results', AdminController.getAssessmentResults);

export default router;
