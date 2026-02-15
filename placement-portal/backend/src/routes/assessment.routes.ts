import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types';

const router = Router();

router.get('/', authenticate, AssessmentController.list);
router.get('/:id', authenticate, AssessmentController.getById);
router.post('/:id/submit', authenticate, AssessmentController.submit);
router.get('/:id/result', authenticate, AssessmentController.getResult);

// Admin-only
router.post('/', authenticate, authorize(UserRole.ADMIN), AssessmentController.create);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), AssessmentController.update);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), AssessmentController.remove);

export default router;
