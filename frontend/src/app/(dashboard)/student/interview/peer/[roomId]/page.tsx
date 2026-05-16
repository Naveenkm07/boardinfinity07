'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Editor, { useMonaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';
import { useAuth } from '@/hooks/useAuth';

export default function PeerInterviewRoom() {
    const { roomId } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    
    // Video state
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerRef = useRef<any>(null);

    // Editor state
    const [editorReady, setEditorReady] = useState(false);
    const bindingRef = useRef<any>(null);
    const providerRef = useRef<any>(null);
    const ydocRef = useRef<any>(null);

    // Language
    const [language, setLanguage] = useState('javascript');

    useEffect(() => {
        // Initialize WebRTC Video (Dynamic import to avoid SSR issues with PeerJS)
        import('peerjs').then(({ default: Peer }) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setLocalStream(stream);
                    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

                    // PeerJS Signaling Logic for 2-person room without custom backend
                    const hostId = `boardinfinity-room-${roomId}-host`;
                    const peer = new Peer(hostId);
                    
                    peer.on('open', () => {
                        console.log('I am the host. Waiting for peer...');
                    });

                    peer.on('error', (err: any) => {
                        if (err.type === 'unavailable-id') {
                            console.log('Host exists. I am the guest. Calling host...');
                            const guestPeer = new Peer(); // Random ID
                            guestPeer.on('open', () => {
                                const call = guestPeer.call(hostId, stream);
                                call.on('stream', (userVideoStream) => {
                                    setRemoteStream(userVideoStream);
                                    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = userVideoStream;
                                });
                            });
                            peerRef.current = guestPeer;
                        } else {
                            console.error('PeerJS error:', err);
                        }
                    });

                    peer.on('call', (call) => {
                        console.log('Receiving call from guest...');
                        call.answer(stream);
                        call.on('stream', (userVideoStream) => {
                            setRemoteStream(userVideoStream);
                            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = userVideoStream;
                        });
                    });

                    if (!peerRef.current) {
                        peerRef.current = peer;
                    }
                })
                .catch((err) => {
                    console.error('Failed to get media devices', err);
                    alert('Could not access camera/microphone. Please check permissions.');
                });
        });

        return () => {
            if (localStream) localStream.getTracks().forEach(track => track.stop());
            if (peerRef.current) peerRef.current.destroy();
            if (providerRef.current) providerRef.current.destroy();
            if (ydocRef.current) ydocRef.current.destroy();
        };
    }, [roomId]);

    const handleEditorDidMount = (editor: any, monaco: any) => {
        // Initialize Yjs and Y-WebRTC for collaborative coding
        const ydoc = new Y.Doc();
        ydocRef.current = ydoc;

        // Use public signaling servers for the prototype
        const provider = new WebrtcProvider(`boardinfinity-code-${roomId}`, ydoc, {
            signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com', 'wss://y-webrtc-signaling-us.herokuapp.com']
        });
        providerRef.current = provider;

        const type = ydoc.getText('monaco');
        
        // Bind Yjs to Monaco Editor
        bindingRef.current = new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness);
        
        // User awareness (cursors)
        provider.awareness.setLocalStateField('user', {
            name: user?.name || 'Anonymous',
            color: '#' + Math.floor(Math.random()*16777215).toString(16)
        });

        setEditorReady(true);
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoEnabled(videoTrack.enabled);
        }
    };

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsAudioEnabled(audioTrack.enabled);
        }
    };

    const leaveRoom = () => {
        if (confirm('Are you sure you want to leave the interview?')) {
            router.push('/student/interview/peer');
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col -m-6 p-6 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-200 mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-gray-900">Peer Interview</h1>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 font-bold text-xs rounded-full uppercase tracking-widest">
                        Room: {roomId}
                    </span>
                </div>
                <div className="flex gap-3">
                    <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                    </select>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={leaveRoom}>
                        Leave Session
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Editor Column */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between shrink-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Collaborative Editor</span>
                        {editorReady ? <span className="flex items-center gap-2 text-xs text-green-400"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Sync Active</span> : <span className="text-xs text-gray-500">Connecting...</span>}
                    </div>
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language={language}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                automaticLayout: true,
                            }}
                            onMount={handleEditorDidMount}
                        />
                    </div>
                </div>

                {/* Video Column */}
                <div className="w-80 shrink-0 flex flex-col gap-4">
                    {/* Remote Video */}
                    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-sm relative flex-1 flex items-center justify-center">
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center p-6 text-gray-500">
                                <div className="text-4xl mb-2 animate-bounce">⏳</div>
                                <p className="text-sm font-medium">Waiting for peer to join...</p>
                            </div>
                        )}
                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-[10px] font-bold">
                            Remote Peer
                        </div>
                    </div>

                    {/* Local Video */}
                    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-sm relative h-48 shrink-0">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-[10px] font-bold">
                            You
                        </div>
                        
                        {/* Video Controls */}
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <button 
                                onClick={toggleAudio}
                                className={`p-2 rounded-full backdrop-blur-md transition ${isAudioEnabled ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-500/80 hover:bg-red-500 text-white'}`}
                            >
                                {isAudioEnabled ? '🎙️' : '🔇'}
                            </button>
                            <button 
                                onClick={toggleVideo}
                                className={`p-2 rounded-full backdrop-blur-md transition ${isVideoEnabled ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-red-500/80 hover:bg-red-500 text-white'}`}
                            >
                                {isVideoEnabled ? '📹' : '🚫'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
