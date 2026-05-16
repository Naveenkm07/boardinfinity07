'use client';

import React, { useEffect, useState } from 'react';
import { trackService } from '../../../services/track.service';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function TracksPage() {
    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        trackService.listTracks().then(setTracks).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl" />)}
        </div>
    </div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Preparation Tracks</h1>
                <p className="text-sm text-gray-500">Curated study paths designed for specific companies and roles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tracks.map((track) => (
                    <Link key={track.id} href={`/student/tracks/${track.id}`}>
                        <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group border-b-4 border-b-primary-500 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="text-8xl">{track.icon}</span>
                            </div>
                            <div className="relative z-10">
                                <div className="text-3xl mb-4">{track.icon}</div>
                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{track.title}</h2>
                                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-1">{track.companyName}</p>
                                <p className="text-sm text-gray-500 mt-4 line-clamp-2">{track.description}</p>
                                
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                        track.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
                                        track.difficulty === 'advanced' ? 'bg-red-50 text-red-700' :
                                        'bg-orange-50 text-orange-700'
                                    }`}>
                                        {track.difficulty}
                                    </span>
                                    <span className="text-xs font-medium text-gray-400">{track.items?.length || 0} Steps</span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
