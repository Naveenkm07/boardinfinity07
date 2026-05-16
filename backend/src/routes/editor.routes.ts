import { Router } from 'express';
import { EditorController } from '../controllers/editor.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/run', EditorController.runCode);
router.post('/save', EditorController.saveCode);
router.get('/submissions', EditorController.getSubmissions);

export default router;
