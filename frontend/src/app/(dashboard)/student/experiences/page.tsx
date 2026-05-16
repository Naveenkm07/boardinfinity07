'use client';

import React, { useEffect, useState } from 'react';
import { experienceService } from '@/services/experience.service';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import Link from 'next/link';

export default function ExperiencesPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        experienceService.getExperiences()
            .then(data => setPosts(data.experiences))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredPosts = posts.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.company.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <span>💬 Interview Forum</span>
                    </h1>
                    <p className="text-gray-500">Real interview experiences from your peers.</p>
                </div>
                <div className="flex gap-3">
                    <input 
                        type="text" 
                        placeholder="Search company or role..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm w-full md:w-64"
                    />
                    <Link 
                        href="/student/experiences/new" 
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 text-sm shrink-0"
                    >
                        <span>Post Yours</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <Link key={post.id} href={`/student/experiences/${post.id}`}>
                            <Card className="h-full p-6 hover:shadow-xl hover:-translate-y-1 transition-all border-none shadow-lg flex flex-col group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase tracking-wider">
                                        {post.company}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-xs text-gray-500 line-clamp-3 mb-6 flex-1 italic">
                                    "{post.content.substring(0, 150)}..."
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                                            {post.author?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500">{post.author?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <div className="flex items-center gap-1 text-[10px] font-bold">
                                            <span>🔼</span> {post.upvotes?.length || 0}
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold">
                                            <span>💬</span> {post.comments?.length || 0}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    )
                )) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-gray-400">No interview experiences found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
