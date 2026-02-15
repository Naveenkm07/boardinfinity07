'use client';

import React, { useEffect, useState } from 'react';
import { assessmentService } from '../../../../services/assessment.service';
import { Assessment, AssessmentResult } from '../../../../types';

const TABS = [
    { label: 'Active', value: 'active' },
    { label: 'Expired', value: 'expired' },
];

export default function AssessmentsPage() {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('active');

    useEffect(() => {
        fetchAssessments();
    }, [tab]);

    async function fetchAssessments() {
        setLoading(true);
        try {
            const data = await assessmentService.listAssessments(1, 20, tab);
            setAssessments(data.assessments);
        } catch (err) {
            console.error('Failed to load assessments:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Assessments</h1>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-1">
                {TABS.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setTab(t.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${tab === t.value
                                ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
            ) : assessments.length === 0 ? (
                <p className="text-center py-20 text-gray-400">No assessments found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((assessment: any) => (
                        <div key={assessment._id || assessment.id} className="rounded-xl bg-white border border-gray-100 shadow-md p-5 hover:shadow-lg transition">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${assessment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {assessment.status}
                                </span>
                                <span className="text-xs text-gray-400">{assessment.category}</span>
                            </div>
                            <h3 className="font-semibold text-lg">{assessment.title}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{assessment.description}</p>
                            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                <span>📝 {assessment.questions?.length || 0} questions</span>
                                <span>⏱ {assessment.duration} min</span>
                            </div>
                            <div className="mt-2 text-sm">
                                <span className="text-gray-400">Due: {new Date(assessment.dueDate).toLocaleDateString()}</span>
                            </div>
                            {assessment.status === 'active' && (
                                <a
                                    href={`/student/assessments/${assessment._id || assessment.id}`}
                                    className="mt-4 block w-full text-center py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition text-sm"
                                >
                                    Start Assessment
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
