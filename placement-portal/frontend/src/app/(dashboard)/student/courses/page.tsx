'use client';

import React, { useEffect, useState } from 'react';
import { courseService } from '../../../../services/course.service';
import { Course } from '../../../../types';

const CATEGORIES = [
    { value: '', label: 'All' },
    { value: 'dsa', label: 'DSA' },
    { value: 'web-dev', label: 'Web Dev' },
    { value: 'system-design', label: 'System Design' },
    { value: 'aptitude', label: 'Aptitude' },
    { value: 'soft-skills', label: 'Soft Skills' },
];

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCourses();
    }, [category, page]);

    async function fetchCourses() {
        setLoading(true);
        try {
            const data = await courseService.listCourses(page, 9, category || undefined);
            setCourses(data.courses);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Failed to load courses:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Courses</h1>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => { setCategory(cat.value); setPage(1); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat.value
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
            ) : courses.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No courses found in this category.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="group rounded-xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all overflow-hidden">
                                <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                    <span className="text-4xl">📚</span>
                                </div>
                                <div className="p-5">
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 mb-2">
                                        {course.category}
                                    </span>
                                    <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition">{course.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                        <span>👨‍🏫 {course.instructor}</span>
                                        <span>{course.lessons?.length || 0} lessons</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">{course.enrolledCount} enrolled</span>
                                        <a
                                            href={`/student/courses/${course.id}`}
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                                        >
                                            View Course →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`h-10 w-10 rounded-lg text-sm font-medium transition ${page === i + 1
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
