import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

router.get('/stats', DashboardController.getStats);
router.get('/upcoming', DashboardController.getUpcoming);

export default router;
