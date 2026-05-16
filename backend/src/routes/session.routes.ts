import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types';

const router = Router();

router.get('/', authenticate, SessionController.list);
router.get('/:id', authenticate, SessionController.getById);
router.post('/:id/attend', authenticate, SessionController.attend);

// Admin-only
router.post('/', authenticate, authorize(UserRole.ADMIN), SessionController.create);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), SessionController.update);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), SessionController.remove);

export default router;
