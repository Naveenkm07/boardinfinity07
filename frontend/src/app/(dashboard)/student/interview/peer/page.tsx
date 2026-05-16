'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function PeerInterviewLobby() {
    const router = useRouter();
    const [roomId, setRoomId] = useState('');

    const createRoom = () => {
        const newRoomId = Math.random().toString(36).substring(2, 9);
        router.push(`/student/interview/peer/${newRoomId}`);
    };

    const joinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomId.trim()) {
            router.push(`/student/interview/peer/${roomId.trim()}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pt-10">
            <div className="text-center">
                <h1 className="text-3xl font-black text-gray-900 mb-2">🤝 Peer-to-Peer Mock Interviews</h1>
                <p className="text-gray-500">Practice live technical interviews with other students using Collaborative Coding and Video Chat.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                        ➕
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Create a Room</h2>
                    <p className="text-sm text-gray-500">Start a new session and invite a peer to join you.</p>
                    <Button onClick={createRoom} className="w-full">
                        Generate Room Link
                    </Button>
                </Card>

                <Card className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                        🔗
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Join a Room</h2>
                    <p className="text-sm text-gray-500">Enter a Room ID shared by your peer to connect.</p>
                    <form onSubmit={joinRoom} className="space-y-3 mt-2">
                        <Input 
                            placeholder="Enter Room ID (e.g. x8k2m)"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="text-center"
                        />
                        <Button type="submit" variant="secondary" className="w-full" disabled={!roomId.trim()}>
                            Join Session
                        </Button>
                    </form>
                </Card>
            </div>
            
            <div className="bg-blue-50 text-blue-800 p-6 rounded-2xl border border-blue-100 mt-8 text-sm leading-relaxed">
                <h3 className="font-bold mb-2 flex items-center gap-2"><span>💡</span> How it works:</h3>
                <ul className="list-disc pl-5 space-y-1">
                    <li>This feature uses <strong>WebRTC</strong> for direct, secure, browser-to-browser video streaming.</li>
                    <li>The <strong>Collaborative Editor</strong> synchronizes your code in real-time.</li>
                    <li>No video data is sent to our servers — it is 100% peer-to-peer!</li>
                    <li>Make sure to grant camera and microphone permissions when joining.</li>
                </ul>
            </div>
        </div>
    );
}
