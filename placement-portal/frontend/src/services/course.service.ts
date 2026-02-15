import api from './api';
import { Course, CourseProgress } from '../types';

export const courseService = {
    async listCourses(page = 1, limit = 10, category?: string) {
        const params: Record<string, string | number> = { page, limit };
        if (category) params.category = category;
        const { data } = await api.get('/courses', { params });
        return data.data as { courses: Course[]; total: number; page: number; totalPages: number };
    },

    async getCourseById(id: string) {
        const { data } = await api.get(`/courses/${id}`);
        return data.data as { course: Course; progress: CourseProgress | null };
    },

    async createCourse(courseData: Partial<Course>) {
        const { data } = await api.post('/courses', courseData);
        return data.data.course as Course;
    },

    async updateCourse(id: string, courseData: Partial<Course>) {
        const { data } = await api.put(`/courses/${id}`, courseData);
        return data.data.course as Course;
    },

    async deleteCourse(id: string) {
        await api.delete(`/courses/${id}`);
    },

    async enrollInCourse(id: string) {
        const { data } = await api.post(`/courses/${id}/enroll`);
        return data.data.progress as CourseProgress;
    },

    async updateProgress(courseId: string, lessonId: string) {
        const { data } = await api.patch(`/courses/${courseId}/progress`, { lessonId });
        return data.data.progress as CourseProgress;
    },
};
