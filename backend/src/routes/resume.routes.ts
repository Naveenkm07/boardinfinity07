import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadResume, uploadResumeMemory } from '../middleware/upload.middleware';

const router = Router();

/**
 * Resume Routes
 * 
 * POST /api/resume/parse            — Upload and parse PDF resume (any authenticated user)
 * POST /api/resume/score            — Score resume against job description
 * POST /api/resume/upload-to-profile — Upload and parse for profile update
 */

router.post(
    '/parse',
    authenticate,
    uploadResumeMemory.single('resume'),
    ResumeController.parse
);

router.post(
    '/score',
    authenticate,
    uploadResumeMemory.single('resume'),
    ResumeController.score
);

router.post(
    '/upload-to-profile',
    authenticate,
    uploadResume.single('resume'),
    ResumeController.uploadToProfile
);

export default router;
