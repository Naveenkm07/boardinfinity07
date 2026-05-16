'use client';

import React, { useEffect, useState } from 'react';
import { courseService } from '../../../../../services/course.service';
import { Course, CourseProgress, Lesson } from '../../../../../types';
import { useParams } from 'next/navigation';

export default function CourseDetailPage() {
    const params = useParams();
    const courseId = params.id as string;
    const [course, setCourse] = useState<Course | null>(null);
    const [progress, setProgress] = useState<CourseProgress | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    async function fetchCourse() {
        try {
            const data = await courseService.getCourseById(courseId);
            setCourse(data.course as Course);
            setProgress(data.progress as CourseProgress | null);
            // Set active lesson to last viewed or first
            if (data.course.lessons?.length > 0) {
                const lastId = data.progress?.lastLessonId;
                const found = data.course.lessons.find((l: Lesson) => l._id === lastId);
                setActiveLesson(found || data.course.lessons[0]);
            }
        } catch (err) {
            console.error('Failed to load course:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleEnroll() {
        setEnrolling(true);
        try {
            const p = await courseService.enrollInCourse(courseId);
            setProgress(p);
        } catch (err) {
            console.error('Failed to enroll:', err);
        } finally {
            setEnrolling(false);
        }
    }

    async function handleLessonComplete(lessonId: string) {
        try {
            const p = await courseService.updateProgress(courseId, lessonId);
            setProgress(p);
        } catch (err) {
            console.error('Failed to update progress:', err);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!course) return <p className="text-center py-10 text-gray-400">Course not found.</p>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar — Lesson List */}
            <div className="lg:col-span-1 rounded-xl bg-white border border-gray-100 shadow-lg p-4 h-fit sticky top-24">
                <h2 className="font-semibold text-sm text-gray-500 mb-3 uppercase tracking-wide">Modules</h2>
                <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                    {course.lessons?.map((lesson, idx) => {
                        const isCompleted = progress?.completedLessons?.includes(lesson._id);
                        const isActive = activeLesson?._id === lesson._id;
                        return (
                            <button
                                key={lesson._id}
                                onClick={() => setActiveLesson(lesson)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition flex items-center gap-2 ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                                        : 'hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${isCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {isCompleted ? '✓' : idx + 1}
                                </span>
                                <span className="truncate">{lesson.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                {progress && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{progress.percentage}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
                {/* Video Player Area */}
                <div className="rounded-xl bg-black aspect-video flex items-center justify-center shadow-xl">
                    {activeLesson?.videoUrl ? (
                        <video
                            key={activeLesson._id}
                            controls
                            className="w-full h-full rounded-xl"
                            src={activeLesson.videoUrl}
                        >
                            Your browser does not support video playback.
                        </video>
                    ) : (
                        <div className="text-white/60 text-center">
                            <p className="text-5xl mb-4">🎬</p>
                            <p className="text-lg">Select a lesson to start watching</p>
                        </div>
                    )}
                </div>

                {/* Lesson Info */}
                <div className="rounded-xl bg-white border border-gray-100 shadow-lg p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-xl font-bold">{activeLesson?.title || course.title}</h1>
                            <p className="text-sm text-gray-500 mt-1">{course.instructor} • {activeLesson?.duration || 0} min</p>
                        </div>
                        {!progress ? (
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
                            >
                                {enrolling ? 'Enrolling...' : 'Enroll Now'}
                            </button>
                        ) : activeLesson && !progress.completedLessons?.includes(activeLesson._id) ? (
                            <button
                                onClick={() => handleLessonComplete(activeLesson._id)}
                                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                            >
                                Mark Complete ✓
                            </button>
                        ) : (
                            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                                ✓ Completed
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 mt-4">{activeLesson?.description || course.description}</p>
                </div>
            </div>
        </div>
    );
}
