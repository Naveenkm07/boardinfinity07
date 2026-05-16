import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', PostController.listPosts);
router.post('/', PostController.createPost);
router.get('/:id', PostController.getPostById);
router.post('/:id/upvote', PostController.upvotePost);
router.post('/:id/comments', PostController.addComment);

export default router;
