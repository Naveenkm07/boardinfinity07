'use client';

import React, { useEffect, useState } from 'react';
import { resourceService } from '../../../../services/resource.service';
import { Resource, ResourceType } from '../../../../types';

const TYPES: { label: string; value: ResourceType | '' }[] = [
    { label: 'All', value: '' },
    { label: 'Interview Guides', value: 'interview-guide' },
    { label: 'Blogs', value: 'blog' },
    { label: 'Videos', value: 'video' },
    { label: 'Documents', value: 'document' },
];

const typeIcons: Record<string, string> = {
    'interview-guide': '🎯',
    blog: '📝',
    video: '🎥',
    document: '📄',
};

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<ResourceType | ''>('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchResources();
    }, [type]);

    async function fetchResources() {
        setLoading(true);
        try {
            const data = await resourceService.listResources(1, 20, (type || undefined) as ResourceType | undefined, search || undefined);
            setResources(data.resources);
        } catch (err) {
            console.error('Failed to load resources:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        fetchResources();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Placement Resources</h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search resources, companies..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                    Search
                </button>
            </form>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setType(t.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${type === t.value
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            ) : resources.length === 0 ? (
                <p className="text-center py-20 text-gray-400">No resources found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource: any) => (
                        <div key={resource._id || resource.id} className="rounded-xl bg-white border border-gray-100 shadow-md p-5 hover:shadow-lg transition">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{typeIcons[resource.type] || '📄'}</span>
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                        {resource.type}
                                    </span>
                                    {resource.company && (
                                        <span className="ml-2 text-xs text-gray-400">{resource.company}</span>
                                    )}
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg">{resource.title}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-3">{resource.content}</p>
                            {resource.tags?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {resource.tags.map((tag: string) => (
                                        <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {resource.url && (
                                <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 block text-sm text-indigo-600 font-medium hover:text-indigo-800 transition"
                                >
                                    Read More →
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
