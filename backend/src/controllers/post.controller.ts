import { Request, Response, NextFunction } from 'express';
import { Post } from '../models/post.model';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';
import mongoose from 'mongoose';

export class PostController {
    /**
     * POST /api/posts
     * Create a new forum post.
     */
    static async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const post = await Post.create({ ...req.body, author: userId });
            ApiResponse.success(res, { post }, 'Post created successfully', 201);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/posts
     * List all posts with optional company/tag filtering.
     */
    static async listPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { company, tag, search } = req.query;
            const query: any = {};

            if (company) query.company = company;
            if (tag) query.tags = tag;
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                ];
            }

            const posts = await Post.find(query)
                .populate('author', 'name profileImage')
                .sort({ createdAt: -1 });

            ApiResponse.success(res, { posts }, 'Posts retrieved successfully');
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/posts/:id
     * Get a single post with comments.
     */
    static async getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const post = await Post.findById(req.params.id)
                .populate('author', 'name profileImage')
                .populate('comments.userId', 'name profileImage');
            
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
     * POST /api/posts/:id/upvote
     * Upvote or remove upvote from a post.
     */
    static async upvotePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const post = await Post.findById(req.params.id);

            if (!post) {
                res.status(404).json({ success: false, message: 'Post not found' });
                return;
            }

            const upvoteIndex = post.upvotes.findIndex(id => id.toString() === userId);
            if (upvoteIndex > -1) {
                post.upvotes.splice(upvoteIndex, 1);
            } else {
                post.upvotes.push(new mongoose.Types.ObjectId(userId) as any);
            }

            await post.save();
            ApiResponse.success(res, { upvotes: post.upvotes.length }, 'Upvote toggled');
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/posts/:id/comments
     * Add a comment to a post.
     */
    static async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const { text } = req.body;

            const post = await Post.findByIdAndUpdate(
                req.params.id,
                { $push: { comments: { userId, text } } },
                { new: true }
            ).populate('comments.userId', 'name profileImage');

            if (!post) {
                res.status(404).json({ success: false, message: 'Post not found' });
                return;
            }

            ApiResponse.success(res, { comments: post.comments }, 'Comment added successfully');
        } catch (error) {
            next(error);
        }
    }
}
