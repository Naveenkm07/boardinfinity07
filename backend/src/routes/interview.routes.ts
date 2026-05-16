import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Interview Routes
 */

router.post('/start', authenticate, InterviewController.startInterview);
router.post('/:id/message', authenticate, InterviewController.sendMessage);
router.get('/me', authenticate, InterviewController.getMyInterviews);
router.get('/:id', authenticate, InterviewController.getInterviewById);

export default router;
