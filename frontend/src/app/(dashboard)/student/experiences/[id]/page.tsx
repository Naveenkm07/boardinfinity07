'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { experienceService } from '@/services/experience.service';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export default function ExperienceDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            experienceService.getExperienceById(id as string)
                .then(setPost)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleUpvote = async () => {
        try {
            await experienceService.upvoteExperience(id as string);
            // Re-fetch to get accurate state
            const fresh = await experienceService.getExperienceById(id as string);
            setPost(fresh);
        } catch (err) {
            console.error(err);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmitting(true);

        try {
            await experienceService.addComment(id as string, comment);
            const fresh = await experienceService.getExperienceById(id as string);
            setPost(fresh);
            setComment('');
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
    if (!post) return <div className="text-center py-20 text-gray-500 font-bold">Post not found.</div>;

    const hasUpvoted = post.upvotes?.some((u: any) => (u._id || u) === user?.id);

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <Card className="p-8 border-none shadow-xl">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                                {post.company}
                            </span>
                            {post.role && (
                                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                    {post.role}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 leading-tight">{post.title}</h1>
                    </div>
                    <Button 
                        variant={hasUpvoted ? 'primary' : 'outline'} 
                        onClick={handleUpvote}
                        className="rounded-xl flex items-center gap-2"
                    >
                        <span>{hasUpvoted ? '🔼 Upvoted' : '🔼 Upvote'}</span>
                        <span className="font-bold">{post.upvotes?.length || 0}</span>
                    </Button>
                </div>

                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-50">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                        {post.author?.name?.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900">{post.author?.name}</p>
                        <p className="text-xs text-gray-400 font-medium">Published on {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="prose prose-indigo max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-8">
                        {post.tags.map((tag: string) => (
                            <span key={tag} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </Card>

            {/* Comments Section */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Comments ({post.comments?.length || 0})</h3>
                
                <Card className="p-6 border-none shadow-lg">
                    <form onSubmit={handleComment} className="space-y-4">
                        <textarea 
                            rows={3}
                            placeholder="Add a comment or ask a question..."
                            className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" isLoading={submitting} className="rounded-xl px-8">
                                Post Comment
                            </Button>
                        </div>
                    </form>
                </Card>

                <div className="space-y-4">
                    {post.comments?.map((c: any, i: number) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-xs flex-shrink-0">
                                {c.userId?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">{c.userId?.name || 'User'}</span>
                                    <span className="text-[10px] text-gray-400 font-bold">{new Date(c.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600">{c.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
