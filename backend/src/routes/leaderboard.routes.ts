import { Router } from 'express';
import { LeaderboardController } from '../controllers/leaderboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', LeaderboardController.getLeaderboard);

export default router;
