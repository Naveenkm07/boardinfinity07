import { Router } from 'express';
import { TrackController } from '../controllers/track.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types';

const router = Router();

router.get('/', authenticate, TrackController.listTracks);
router.get('/:id', authenticate, TrackController.getTrackById);

router.post('/', authenticate, authorize(UserRole.ADMIN), TrackController.createTrack);
router.patch('/:id', authenticate, authorize(UserRole.ADMIN), TrackController.updateTrack);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), TrackController.deleteTrack);

export default router;
