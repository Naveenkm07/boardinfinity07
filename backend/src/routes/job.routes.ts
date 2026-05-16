import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { UserRole } from '../types';

const router = Router();

// Publicly available (but still require authentication for listing/details)
router.get('/', authenticate, JobController.listJobs);
router.get('/:id', authenticate, JobController.getJobById);

// Student only
router.get('/recommendations', authenticate, authorize(UserRole.STUDENT), JobController.getRecommendations);
router.post('/:id/apply', authenticate, authorize(UserRole.STUDENT), JobController.applyForJob);
router.get('/applications/me', authenticate, authorize(UserRole.STUDENT), JobController.getMyApplications);

// Admin only
router.post('/', authenticate, authorize(UserRole.ADMIN), JobController.createJob);
router.patch('/:id', authenticate, authorize(UserRole.ADMIN), JobController.updateJob);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), JobController.deleteJob);
router.get('/:id/applications', authenticate, authorize(UserRole.ADMIN), JobController.getJobApplications);
router.patch('/applications/:id/status', authenticate, authorize(UserRole.ADMIN), JobController.updateApplicationStatus);
router.post('/applications/:id/score', authenticate, authorize(UserRole.ADMIN), JobController.scoreApplication);

export default router;
