import { Request, Response, NextFunction } from 'express';
import { ForumPost } from '../models/forum.model';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

export class ForumController {
    /**
     * POST /api/forum
     * Create a new forum post.
     */
    static async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authorId = (req as AuthRequest).user!.userId;
            const post = await ForumPost.create({ ...req.body, authorId });
            ApiResponse.success(res, { post }, 'Post created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/forum
     * List all posts with filtering and search.
     */
    static async listPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { company, search, tag } = req.query;
            const query: any = {};

            if (company) query.company = company;
            if (tag) query.tags = tag;
            if (search) {
                query.$text = { $search: search as string };
            }

            const posts = await ForumPost.find(query)
                .sort({ createdAt: -1 })
                .populate('authorId', 'name profileImage department');
            
            ApiResponse.success(res, { posts }, 'Posts retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/forum/:id
     * Get single post details with comments.
     */
    static async getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const post = await ForumPost.findById(req.params.id)
                .populate('authorId', 'name profileImage department')
                .populate('comments.authorId', 'name profileImage');
            
            if (!post) {
                res.status(404).json({ success: false, message: 'Post not found' });
                return;
            }
            ApiResponse.success(res, { post }, 'Post retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/forum/:id/upvote
     * Toggle upvote on a post.
     */
    static async upvotePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const post = await ForumPost.findById(req.params.id);
            
            if (!post) {
                res.status(404).json({ success: false, message: 'Post not found' });
                return;
            }

            const upvoteIndex = post.upvotes.indexOf(userId as any);
            if (upvoteIndex === -1) {
                post.upvotes.push(userId as any);
            } else {
                post.upvotes.splice(upvoteIndex, 1);
            }

            await post.save();
            ApiResponse.success(res, { upvotes: post.upvotes.length }, 'Upvote updated');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/forum/:id/comments
     * Add a comment to a post.
     */
    static async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authorId = (req as AuthRequest).user!.userId;
            const { content } = req.body;
            
            const post = await ForumPost.findByIdAndUpdate(
                req.params.id,
                { $push: { comments: { authorId, content } } },
                { new: true }
            ).populate('comments.authorId', 'name profileImage');

            ApiResponse.success(res, { comments: post?.comments }, 'Comment added');
        } catch (error) {
            next(error);
        }
    }
}
