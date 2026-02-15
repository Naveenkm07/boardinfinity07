import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/course.service';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../types';

export class CourseController {
    static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const category = req.query.category as string | undefined;
            const data = await CourseService.listCourses(page, limit, category);
            ApiResponse.success(res, data, 'Courses retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as AuthRequest).user?.userId;
            const data = await CourseService.getCourseById(req.params.id as string, userId);
            ApiResponse.success(res, data, 'Course retrieved');
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const course = await CourseService.createCourse(req.body, (req as AuthRequest).user!.userId);
            ApiResponse.created(res, { course }, 'Course created');
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const course = await CourseService.updateCourse(req.params.id as string, req.body);
            ApiResponse.success(res, { course }, 'Course updated');
        } catch (error) {
            next(error);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await CourseService.deleteCourse(req.params.id as string);
            ApiResponse.success(res, null, 'Course deleted');
        } catch (error) {
            next(error);
        }
    }

    static async enroll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const progress = await CourseService.enrollInCourse(
                req.params.id as string,
                (req as AuthRequest).user!.userId,
            );
            ApiResponse.created(res, { progress }, 'Enrolled successfully');
        } catch (error) {
            next(error);
        }
    }

    static async updateProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { lessonId } = req.body;
            const progress = await CourseService.updateProgress(
                req.params.id as string,
                (req as AuthRequest).user!.userId,
                lessonId,
            );
            ApiResponse.success(res, { progress }, 'Progress updated');
        } catch (error) {
            next(error);
        }
    }
}
