'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { trackService } from '@/services/track.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';

export default function TrackDetailPage() {
    const { id } = useParams();
    const [track, setTrack] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            trackService.getTrackById(id as string)
                .then(setTrack)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
    if (!track) return <div className="text-center py-20 text-gray-500 font-bold">Track not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 md:p-12 text-white shadow-2xl">
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{track.icon}</span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10">
                            {track.difficulty}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black leading-tight">{track.title}</h1>
                    <p className="text-indigo-100 text-lg font-medium">Preparation Path for <span className="text-white font-bold">{track.companyName}</span></p>
                    <p className="max-w-2xl text-indigo-100/80 leading-relaxed text-sm">{track.description}</p>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/4 bg-gradient-to-l from-white/10 to-transparent skew-x-12" />
            </div>

            {/* Timeline of Items */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 px-2">
                    <span>🏁 Preparation Steps</span>
                </h2>

                <div className="space-y-4">
                    {track.items.sort((a: any, b: any) => a.order - b.order).map((item: any, index: number) => (
                        <div key={index} className="flex gap-6 group">
                            {/* Connector Line */}
                            <div className="hidden md:flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                                    index === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400 border border-gray-100'
                                }`}>
                                    {item.order}
                                </div>
                                <div className="flex-1 w-0.5 bg-gray-100 group-last:bg-transparent my-2" />
                            </div>

                            <Card className="flex-1 p-6 hover:shadow-xl transition-all border-none shadow-lg group-hover:ring-2 group-hover:ring-indigo-500/20">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex gap-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                                            item.type === 'course' ? 'bg-blue-50 text-blue-600' :
                                            item.type === 'assessment' ? 'bg-purple-50 text-purple-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            {item.type === 'course' ? '📚' : item.type === 'assessment' ? '📝' : '📄'}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                                    item.type === 'course' ? 'text-blue-500' :
                                                    item.type === 'assessment' ? 'text-purple-500' :
                                                    'text-amber-500'
                                                }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">{item.itemId?.title || 'Loading content...'}</h3>
                                            <p className="text-xs text-gray-500 line-clamp-1">{item.itemId?.description || 'Learn more about this step'}</p>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        <Link href={`/student/${item.type}s/${item.itemId?._id || item.itemId?.id}`}>
                                            <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest px-6 py-2.5">
                                                {item.type === 'course' ? 'Watch Now' : item.type === 'assessment' ? 'Take Test' : 'Read Now'}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / Community */}
            <Card className="p-8 bg-indigo-50 border-none shadow-inner text-center space-y-6">
                <div className="max-w-lg mx-auto space-y-2">
                    <h3 className="text-xl font-bold text-indigo-900">Feeling Stuck?</h3>
                    <p className="text-sm text-indigo-700/70">Connect with peers who are also preparing for <span className="font-bold">{track.companyName}</span> in the Interview Forum.</p>
                </div>
                <Link href={`/student/experiences?company=${track.companyName}`}>
                    <Button className="rounded-2xl px-10 py-4 font-black shadow-lg shadow-indigo-200">
                        Visit Forum
                    </Button>
                </Link>
            </Card>
        </div>
    );
}
