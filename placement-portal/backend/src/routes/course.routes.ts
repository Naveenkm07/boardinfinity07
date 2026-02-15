import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types';

const router = Router();

// Public: list and view courses
router.get('/', CourseController.list);
router.get('/:id', authenticate, CourseController.getById);

// Student: enroll and update progress
router.post('/:id/enroll', authenticate, CourseController.enroll);
router.patch('/:id/progress', authenticate, CourseController.updateProgress);

// Admin: CRUD
router.post('/', authenticate, authorize(UserRole.ADMIN), CourseController.create);
router.put('/:id', authenticate, authorize(UserRole.ADMIN), CourseController.update);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), CourseController.remove);

export default router;
