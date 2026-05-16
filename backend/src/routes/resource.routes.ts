import { Router } from 'express';
import { ResourceController } from '../controllers/resource.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types';

const router = Router();

router.get('/', authenticate, ResourceController.list);
router.get('/:id', authenticate, ResourceController.getById);

// Admin-only
router.post('/', authenticate, authorize(UserRole.ADMIN), ResourceController.create);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), ResourceController.update);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), ResourceController.remove);

export default router;
