import { Router } from 'express';
import { ForumController } from '../controllers/forum.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Forum Routes
 */

router.get('/', authenticate, ForumController.listPosts);
router.post('/', authenticate, ForumController.createPost);
router.get('/:id', authenticate, ForumController.getPostById);
router.post('/:id/upvote', authenticate, ForumController.upvotePost);
router.post('/:id/comments', authenticate, ForumController.addComment);

export default router;
