'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { assessmentService } from '../../../../../services/assessment.service';
import { Assessment, AssessmentResult } from '../../../../../types';

export default function TakeAssessmentPage() {
    const params = useParams();
    const router = useRouter();
    const assessmentId = params.id as string;

    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [existingResult, setExistingResult] = useState<AssessmentResult | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await assessmentService.getAssessmentById(assessmentId);
                setAssessment(data.assessment);
                setExistingResult(data.result);
                if (!data.result) {
                    setAnswers(new Array(data.assessment.questions.length).fill(-1));
                    setTimeLeft(data.assessment.duration * 60);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [assessmentId]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0 || result || existingResult) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft, result, existingResult]);

    const handleSubmit = useCallback(async () => {
        if (submitting || result) return;
        setSubmitting(true);
        try {
            // Fill unanswered with 0
            const finalAnswers = answers.map((a) => (a === -1 ? 0 : a));
            const res = await assessmentService.submitAssessment(assessmentId, finalAnswers);
            setResult(res);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to submit');
        } finally {
            setSubmitting(false);
        }
    }, [answers, assessmentId, submitting, result]);

    function formatTime(seconds: number) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!assessment) return <p className="text-center py-10 text-gray-400">Assessment not found.</p>;

    // Show result screen
    const displayResult = result || existingResult;
    if (displayResult) {
        return (
            <div className="max-w-lg mx-auto mt-10">
                <div className="rounded-2xl bg-white border border-gray-100 shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4">{displayResult.percentage >= 70 ? '🎉' : '📊'}</div>
                    <h1 className="text-2xl font-bold mb-2">Assessment Complete</h1>
                    <p className="text-gray-500 mb-6">{assessment.title}</p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-indigo-50">
                            <p className="text-2xl font-bold text-indigo-600">{displayResult.score}</p>
                            <p className="text-xs text-gray-500">Score</p>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-50">
                            <p className="text-2xl font-bold text-purple-600">{displayResult.totalPoints}</p>
                            <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-50">
                            <p className="text-2xl font-bold text-green-600">{displayResult.percentage}%</p>
                            <p className="text-xs text-gray-500">Percentage</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/student/assessments')}
                        className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    >
                        Back to Assessments
                    </button>
                </div>
            </div>
        );
    }

    const question = assessment.questions[currentQ];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header with Timer */}
            <div className="flex items-center justify-between rounded-xl bg-white border border-gray-100 shadow-lg p-4">
                <div>
                    <h1 className="font-bold text-lg">{assessment.title}</h1>
                    <p className="text-sm text-gray-400">Question {currentQ + 1} of {assessment.questions.length}</p>
                </div>
                <div className={`text-2xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-gray-700'}`}>
                    ⏱ {formatTime(timeLeft)}
                </div>
            </div>

            {/* Question */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-lg p-6">
                <p className="text-lg font-medium mb-6">{question.text}</p>
                <div className="space-y-3">
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                const newAnswers = [...answers];
                                newAnswers[currentQ] = idx;
                                setAnswers(newAnswers);
                            }}
                            className={`w-full text-left p-4 rounded-lg border-2 transition ${answers[currentQ] === idx
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <span className="font-medium mr-3">{String.fromCharCode(65 + idx)}.</span>
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                    disabled={currentQ === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium disabled:opacity-50 transition"
                >
                    ← Previous
                </button>

                {/* Question Navigation Dots */}
                <div className="flex gap-1 flex-wrap justify-center max-w-md">
                    {assessment.questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentQ(i)}
                            className={`h-8 w-8 rounded-lg text-xs font-medium transition ${i === currentQ
                                    ? 'bg-indigo-600 text-white'
                                    : answers[i] !== -1
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {currentQ < assessment.questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentQ(currentQ + 1)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 transition"
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                )}
            </div>
        </div>
    );
}
