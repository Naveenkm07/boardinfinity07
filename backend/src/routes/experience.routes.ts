import { Router } from 'express';
import { ExperienceController } from '../controllers/experience.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', ExperienceController.createExperience);
router.get('/', ExperienceController.listExperiences);
router.get('/:id', ExperienceController.getExperienceById);
router.patch('/:id', ExperienceController.updateExperience);
router.delete('/:id', ExperienceController.deleteExperience);
router.post('/:id/upvote', ExperienceController.upvoteExperience);
router.post('/:id/comment', ExperienceController.addComment);

export default router;
