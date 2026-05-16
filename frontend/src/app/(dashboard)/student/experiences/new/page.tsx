'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { experienceService } from '@/services/experience.service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function NewExperiencePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        role: '',
        content: '',
        tags: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
            await experienceService.createExperience({
                ...formData,
                tags: tagsArray,
            });
            router.push('/student/experiences');
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">Share Your Experience</h1>
                <p className="text-gray-500 text-sm">Help your juniors by sharing your interview journey.</p>
            </div>

            <Card className="p-8 border-none shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        label="Title" 
                        placeholder="e.g. My Amazon SDE-1 Interview Experience" 
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            label="Company" 
                            placeholder="e.g. Amazon" 
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            required
                        />
                        <Input 
                            label="Role" 
                            placeholder="e.g. Software Engineer" 
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">Experience Details</label>
                        <textarea 
                            rows={12}
                            placeholder="Describe the rounds, questions asked, and your advice..."
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm leading-relaxed"
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            required
                        />
                    </div>

                    <Input 
                        label="Tags (comma separated)" 
                        placeholder="e.g. dsa, system design, hr round" 
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => router.back()}
                            className="px-8 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            isLoading={isLoading}
                            className="px-10 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                            Publish Experience
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
