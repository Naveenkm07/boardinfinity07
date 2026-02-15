import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import dashboardRoutes from './dashboard.routes';
import courseRoutes from './course.routes';
import sessionRoutes from './session.routes';
import assessmentRoutes from './assessment.routes';
import resourceRoutes from './resource.routes';
import competitionRoutes from './competition.routes';
import editorRoutes from './editor.routes';
import adminRoutes from './admin.routes';

const router = Router();

/**
 * Route aggregator — mounts all feature routes under their prefixes.
 * All routes are prefixed with /api in app.ts.
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/courses', courseRoutes);
router.use('/sessions', sessionRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/resources', resourceRoutes);
router.use('/competitions', competitionRoutes);
router.use('/editor', editorRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;
