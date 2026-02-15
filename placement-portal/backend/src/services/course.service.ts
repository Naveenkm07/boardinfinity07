import { Course, ICourseDocument } from '../models/course.model';
import { Progress } from '../models/progress.model';
import { ApiError } from '../utils/ApiError';

/**
 * Course Service — CRUD + enrollment + progress tracking.
 */
export class CourseService {
    static async listCourses(page: number, limit: number, category?: string) {
        const filter: Record<string, unknown> = { isPublished: true };
        if (category) filter.category = category;

        const [courses, total] = await Promise.all([
            Course.find(filter)
                .select('-lessons.videoUrl') // Don't expose video URLs in listings
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Course.countDocuments(filter),
        ]);

        return { courses, total, page, totalPages: Math.ceil(total / limit) };
    }

    static async getCourseById(courseId: string, userId?: string) {
        const course = await Course.findById(courseId);
        if (!course) throw ApiError.notFound('Course not found');

        let progress = null;
        if (userId) {
            progress = await Progress.findOne({ userId, courseId }).lean();
        }

        return { course: course.toJSON(), progress };
    }

    static async createCourse(data: Partial<ICourseDocument>, createdBy: string) {
        const course = await Course.create({ ...data, createdBy });
        return course.toJSON();
    }

    static async updateCourse(courseId: string, data: Partial<ICourseDocument>) {
        const course = await Course.findByIdAndUpdate(courseId, data, { new: true, runValidators: true });
        if (!course) throw ApiError.notFound('Course not found');
        return course.toJSON();
    }

    static async deleteCourse(courseId: string) {
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) throw ApiError.notFound('Course not found');
        // Clean up related progress records
        await Progress.deleteMany({ courseId });
    }

    static async enrollInCourse(courseId: string, userId: string) {
        const course = await Course.findById(courseId);
        if (!course) throw ApiError.notFound('Course not found');

        const existing = await Progress.findOne({ userId, courseId });
        if (existing) throw ApiError.badRequest('Already enrolled in this course');

        const progress = await Progress.create({
            userId,
            courseId,
            completedLessons: [],
            lastLessonId: course.lessons.length > 0 ? course.lessons[0]._id : '',
            percentage: 0,
        });

        await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

        return progress.toJSON();
    }

    static async updateProgress(courseId: string, userId: string, lessonId: string) {
        const course = await Course.findById(courseId);
        if (!course) throw ApiError.notFound('Course not found');

        let progress = await Progress.findOne({ userId, courseId });
        if (!progress) throw ApiError.badRequest('Not enrolled in this course');

        // Add lesson to completed list if not already there
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
        }
        progress.lastLessonId = lessonId;
        progress.percentage = Math.round(
            (progress.completedLessons.length / course.lessons.length) * 100,
        );

        if (progress.percentage === 100 && !progress.completedAt) {
            progress.completedAt = new Date();
        }

        await progress.save();
        return progress.toJSON();
    }
}
