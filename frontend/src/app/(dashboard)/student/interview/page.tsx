'use client';

import React, { useState, useEffect, useRef } from 'react';
import { interviewService, Interview, Message } from '@/services/interview.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function MockInterviewPage() {
    const [step, setStep] = useState<'setup' | 'chat' | 'result'>('setup');
    const [type, setType] = useState('technical');
    const [topic, setTopic] = useState('');
    const [currentInterview, setCurrentInterview] = useState<Interview | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleStart = async () => {
        if (!topic.trim()) {
            setError('Please provide a topic (e.g., React, Java, HR)');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await interviewService.startInterview(type, topic);
            if (response.success && response.data) {
                setCurrentInterview(response.data.interview);
                setMessages(response.data.interview.messages);
                setStep('chat');
            }
        } catch (err) {
            setError('Failed to start interview. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !currentInterview) return;

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await interviewService.sendMessage(currentInterview.id, input);
            if (response.success && response.data) {
                const aiMsg: Message = {
                    role: 'assistant',
                    content: response.data.response,
                    timestamp: new Date().toISOString(),
                };
                setMessages(prev => [...prev, aiMsg]);

                if (response.data.status === 'completed') {
                    setTimeout(() => {
                        setStep('result');
                        if (currentInterview) {
                            setCurrentInterview({
                                ...currentInterview,
                                status: 'completed',
                                feedback: response.data.feedback,
                                score: response.data.score
                            });
                        }
                    }, 2000);
                }
            }
        } catch (err) {
            setError('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'setup') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">AI Mock Interview</h1>
                    <p className="text-gray-500">Practice your technical and HR skills with our AI recruiter.</p>
                </div>

                <Card className="p-8 space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Interview Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setType('technical')}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                    type === 'technical' ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <div className="text-2xl mb-2">💻</div>
                                <div className="font-bold text-gray-900">Technical</div>
                                <div className="text-xs text-gray-500">Coding, architecture, and core concepts.</div>
                            </button>
                            <button
                                onClick={() => setType('hr')}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                    type === 'hr' ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                                }`}
                            >
                                <div className="text-2xl mb-2">🤝</div>
                                <div className="font-bold text-gray-900">HR / Behavioral</div>
                                <div className="text-xs text-gray-500">Soft skills, teamwork, and situation handling.</div>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Topic / Role</label>
                        <Input
                            placeholder="e.g. Frontend Developer, Java Specialist, Fresh Graduate"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <p className="text-[10px] text-gray-400">The AI will tailor the questions based on this topic.</p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <Button 
                        className="w-full py-6 text-lg font-bold" 
                        onClick={handleStart}
                        isLoading={isLoading}
                    >
                        Start Mock Interview
                    </Button>
                </Card>
            </div>
        );
    }

    if (step === 'chat') {
        return (
            <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                            AI
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900">AI Recruiter</h2>
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                Interview in progress...
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setStep('setup')}>End Session</Button>
                </div>

                <Card className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-primary-600 text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            placeholder="Type your answer here..."
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </Card>
            </div>
        );
    }

    if (step === 'result') {
        return (
            <div className="max-w-3xl mx-auto space-y-6">
                <Card className="p-8 text-center space-y-6 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-indigo-500" />
                    
                    <div className="space-y-2">
                        <div className="text-4xl">🎉</div>
                        <h2 className="text-2xl font-bold text-gray-900">Interview Completed!</h2>
                        <p className="text-gray-500">Great job practicing. Here's your performance analysis.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 bg-primary-50 rounded-2xl border border-primary-100">
                            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Score</p>
                            <p className="text-4xl font-black text-primary-700">{currentInterview?.score || 0}%</p>
                        </div>
                        <div className="md:col-span-2 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Verdict</p>
                            <p className="text-sm text-gray-700 leading-relaxed italic">
                                "The candidate showed good understanding but can work on articulation."
                            </p>
                        </div>
                    </div>

                    <div className="text-left space-y-4">
                        <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Recruiter Feedback</h3>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {currentInterview?.feedback || "Loading feedback..."}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                        <Button className="flex-1 py-6" onClick={() => setStep('setup')}>Start New Interview</Button>
                        <Button variant="outline" className="flex-1 py-6">Share Report</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return null;
}
