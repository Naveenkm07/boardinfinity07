'use client';

import React, { useState } from 'react';
import { resumeService } from '@/services/resume.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export default function ResumeToolsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        score: number;
        matchedSkills: string[];
        missingSkills: string[];
        feedback: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleScore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !jobDescription) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await resumeService.scoreResume(file, jobDescription);
            if (response.success && response.data) {
                setResult(response.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to score resume. Ensure Gemini API key is set.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">AI Resume Tools</h1>
                <p className="text-gray-500">Analyze your resume against job descriptions using Google Gemini AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <Card className="p-6 space-y-6">
                    <h2 className="text-xl font-bold">ATS Scorer</h2>
                    <form onSubmit={handleScore} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF)</label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                            <textarea
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-48"
                                placeholder="Paste the job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                required
                            />
                        </div>
                        <Button 
                            type="submit" 
                            className="w-full" 
                            isLoading={isLoading}
                            disabled={!file || !jobDescription}
                        >
                            Analyze with AI
                        </Button>
                    </form>
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                </Card>

                {/* Result Section */}
                <div className="space-y-6">
                    {isLoading ? (
                        <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4 h-full">
                            <Spinner />
                            <p className="text-gray-500 animate-pulse">AI is analyzing your resume... This may take a few seconds.</p>
                        </Card>
                    ) : result ? (
                        <Card className="p-6 space-y-6 border-t-4 border-indigo-600">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold">Analysis Results</h3>
                                <div className={`flex items-center justify-center h-16 w-16 rounded-full border-4 ${
                                    result.score >= 80 ? 'border-green-500 text-green-600' :
                                    result.score >= 50 ? 'border-orange-500 text-orange-600' :
                                    'border-red-500 text-red-600'
                                } font-bold text-xl`}>
                                    {result.score}%
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">Feedback</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">{result.feedback}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-green-700 mb-2 uppercase tracking-wider">Matched Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.matchedSkills.map(skill => (
                                            <span key={skill} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-red-700 mb-2 uppercase tracking-wider">Missing Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingSkills.map(skill => (
                                            <span key={skill} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium border border-red-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-12 flex flex-col items-center justify-center text-center space-y-4 h-full border-dashed">
                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl">
                                🤖
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-gray-900">Ready for Analysis</p>
                                <p className="text-gray-500 text-sm max-w-xs">Upload your resume and a job description to see how you rank.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
