'use client';

import React, { useEffect, useState } from 'react';
import { analysisService, SkillGapAnalysis } from '@/services/analysis.service';
import { Spinner } from '@/components/ui/Spinner';

export const SkillGapAnalysisSection: React.FC = () => {
    const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await analysisService.getSkillGapAnalysis();
                if (response.success && response.data) {
                    setAnalysis(response.data);
                }
            } catch (err) {
                setError('Failed to load skill analysis.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, []);

    if (loading) return <div className="py-8 flex justify-center"><Spinner /></div>;
    if (error) return <div className="py-4 text-red-500 text-sm">{error}</div>;
    if (!analysis) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Missing Skills (Market Trends)</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.map(skill => (
                            <span key={skill} className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100 uppercase">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Current Stack</h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.currentSkills.map(skill => (
                            <span key={skill} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-100 uppercase">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-sm font-bold text-indigo-700 mb-2 flex items-center gap-2">
                    <span>💡</span> Personalized Learning Path
                </h4>
                <div className="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap italic">
                    {analysis.learningPath}
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Market Pulse (Hot Skills)</h4>
                <div className="flex flex-wrap justify-center gap-2">
                    {analysis.marketTrends.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full border border-gray-200 uppercase">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
