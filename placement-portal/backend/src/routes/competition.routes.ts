import { Router } from 'express';
import { CompetitionController } from '../controllers/competition.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types';

const router = Router();

router.get('/', authenticate, CompetitionController.list);
router.get('/:id', authenticate, CompetitionController.getById);
router.post('/:id/register', authenticate, CompetitionController.register);

// Admin-only
router.post('/', authenticate, authorize(UserRole.ADMIN), CompetitionController.create);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), CompetitionController.update);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), CompetitionController.remove);

export default router;
