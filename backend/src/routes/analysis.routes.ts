import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Analysis Routes
 */

router.get('/skill-gap', authenticate, AnalysisController.getSkillGapAnalysis);

export default router;
