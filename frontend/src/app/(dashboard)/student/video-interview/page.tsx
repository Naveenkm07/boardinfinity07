'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function VideoInterviewPage() {
    const { user } = useAuth();
    const [peerId, setPeerId] = useState<string>('');
    const [remotePeerId, setRemotePeerId] = useState<string>('');
    const [peer, setPeer] = useState<any>(null);
    const [call, setCall] = useState<any>(null);
    const [isCalling, setIsCalling] = useState<boolean>(false);
    const [isReceivingCall, setIsReceivingCall] = useState<boolean>(false);
    const [callerId, setCallerId] = useState<string>('');

    const myVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Dynamically import PeerJS so it only runs on the client
        import('peerjs').then(({ default: Peer }) => {
            const newPeer = new Peer();

            newPeer.on('open', (id) => {
                setPeerId(id);
            });

            newPeer.on('call', (incomingCall) => {
                setCall(incomingCall);
                setIsReceivingCall(true);
                setCallerId(incomingCall.peer);
            });

            setPeer(newPeer);
        });

        // Cleanup on unmount
        return () => {
            if (peer) {
                peer.destroy();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startLocalStream = async (): Promise<MediaStream | null> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (myVideoRef.current) {
                myVideoRef.current.srcObject = stream;
            }
            return stream;
        } catch (err) {
            console.error('Failed to get local stream', err);
            alert('Could not access camera or microphone. Please check your permissions.');
            return null;
        }
    };

    const handleCall = async () => {
        if (!peer || !remotePeerId) return;

        setIsCalling(true);
        const stream = await startLocalStream();
        if (!stream) {
            setIsCalling(false);
            return;
        }

        const outgoingCall = peer.call(remotePeerId, stream);
        
        outgoingCall.on('stream', (remoteStream: MediaStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
        });

        outgoingCall.on('close', () => {
            setIsCalling(false);
            stopMediaTracks(remoteVideoRef.current?.srcObject as MediaStream);
        });

        setCall(outgoingCall);
    };

    const handleAnswer = async () => {
        if (!call) return;

        const stream = await startLocalStream();
        if (!stream) return;

        call.answer(stream);
        setIsReceivingCall(false);
        setIsCalling(true);

        call.on('stream', (remoteStream: MediaStream) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }
        });

        call.on('close', () => {
            setIsCalling(false);
            stopMediaTracks(remoteVideoRef.current?.srcObject as MediaStream);
        });
    };

    const handleReject = () => {
        if (call) {
            call.close();
            setIsReceivingCall(false);
            setCall(null);
        }
    };

    const handleEndCall = () => {
        if (call) {
            call.close();
        }
        setIsCalling(false);
        setIsReceivingCall(false);
        setCall(null);
        
        stopMediaTracks(myVideoRef.current?.srcObject as MediaStream);
        stopMediaTracks(remoteVideoRef.current?.srcObject as MediaStream);
    };

    const stopMediaTracks = (stream: MediaStream | null) => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Peer-to-Peer Video Interview</h1>
                    <p className="text-sm text-gray-500">Practice mock interviews live with your peers via WebRTC.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Connection Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Your Connection ID</h2>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 break-all text-center">
                            {peerId ? (
                                <span className="font-mono text-lg font-semibold text-primary-600 select-all">{peerId}</span>
                            ) : (
                                <span className="text-gray-400 animate-pulse text-sm">Generating ID...</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                            Share this ID with your peer so they can call you.
                        </p>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900">Call a Peer</h2>
                        <Input
                            label="Peer ID to call"
                            placeholder="Enter the ID of the person you want to call"
                            value={remotePeerId}
                            onChange={(e) => setRemotePeerId(e.target.value)}
                            disabled={isCalling || isReceivingCall}
                        />
                        <Button 
                            className="w-full" 
                            onClick={handleCall} 
                            disabled={!remotePeerId || isCalling || isReceivingCall || !peerId}
                        >
                            📞 Start Video Call
                        </Button>
                    </Card>

                    {isReceivingCall && (
                        <Card className="p-6 space-y-4 border-2 border-primary-500 bg-primary-50 animate-in fade-in zoom-in duration-300 shadow-xl">
                            <h2 className="text-lg font-bold text-primary-900 text-center animate-pulse">Incoming Call!</h2>
                            <p className="text-xs text-primary-700 text-center break-all font-mono">From: {callerId}</p>
                            <div className="flex gap-3">
                                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={handleAnswer}>
                                    ✅ Answer
                                </Button>
                                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleReject}>
                                    ❌ Reject
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Video Area */}
                <Card className="lg:col-span-2 p-4 bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[400px]">
                    {!isCalling ? (
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                                <span className="text-4xl">📹</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Ready to Connect</h3>
                            <p className="text-gray-400 text-sm max-w-sm">
                                Enter a peer ID on the left to start a mock interview, or wait for someone to call you.
                            </p>
                        </div>
                    ) : (
                        <div className="w-full h-full relative flex items-center justify-center">
                            {/* Remote Video (Main) */}
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-contain bg-black rounded-lg"
                            />
                            
                            {/* Local Video (PiP) */}
                            <div className="absolute bottom-4 right-4 w-1/4 max-w-[200px] aspect-video bg-black rounded-lg overflow-hidden border-2 border-gray-700 shadow-2xl">
                                <video
                                    ref={myVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                            </div>

                            {/* Controls Overlay */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 backdrop-blur px-6 py-3 rounded-full border border-gray-700 shadow-xl">
                                <div className="flex items-center gap-2 mr-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Live</span>
                                </div>
                                <button 
                                    onClick={handleEndCall}
                                    className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 shadow-lg"
                                    title="End Call"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
