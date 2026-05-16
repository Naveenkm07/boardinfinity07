'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/user.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        phone: '',
        department: '',
        rollNumber: '',
        summary: '',
        socialLinks: {
            github: '',
            linkedin: '',
            twitter: '',
            portfolio: '',
        },
        experience: [] as any[],
        education: [] as any[],
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                phone: user.phone || '',
                department: user.department || '',
                rollNumber: user.rollNumber || '',
                summary: user.summary || '',
                socialLinks: {
                    github: user.socialLinks?.github || '',
                    linkedin: user.socialLinks?.linkedin || '',
                    twitter: user.socialLinks?.twitter || '',
                    portfolio: user.socialLinks?.portfolio || '',
                },
                experience: user.experience || [],
                education: user.education || [],
            });
        }
    }, [user]);

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { company: '', title: '', startDate: '', endDate: '', current: false, description: '' }]
        }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { school: '', degree: '', fieldOfStudy: '', startYear: new Date().getFullYear() }]
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('social-')) {
            const platform = name.replace('social-', '');
            setFormData((prev) => ({
                ...prev,
                socialLinks: {
                    ...prev.socialLinks,
                    [platform]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await userService.updateProfile(formData);
            if (response.success && response.data) {
                updateUser(response.data.user);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'An error occurred while updating profile',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setMessage({ type: 'error', text: 'Please upload a PDF file.' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await userService.uploadResume(file);
            if (response.success && response.data) {
                updateUser(response.data.user);
                setMessage({ type: 'success', text: 'Resume uploaded and skills extracted!' });
            } else {
                setMessage({ type: 'error', text: response.message || 'Failed to upload resume' });
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'An error occurred while uploading resume',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const syncGithub = async () => {
        setIsLoading(true);
        try {
            const response = await userService.syncGithub();
            if (response.success) {
                // Refresh profile to get updated repos
                const profileRes = await userService.getProfile();
                if (profileRes.data) {
                    updateUser(profileRes.data.user);
                    setMessage({ type: 'success', text: 'GitHub projects synced!' });
                }
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to sync GitHub' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <div className="flex items-center gap-3">
                    {user.socialLinks?.github && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={syncGithub}
                            disabled={isLoading}
                        >
                            Sync GitHub Projects
                        </Button>
                    )}
                    {user.username && (
                        <a 
                            href={`/portfolio/${user.username}`} 
                            target="_blank" 
                            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                            View Portfolio
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <Card className="p-6 text-center space-y-4">
                        <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto text-3xl text-indigo-600 font-bold overflow-hidden">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                user.name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase">
                                {user.role}
                            </span>
                        </div>
                    </Card>

                    <Card className="p-6 space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Resume & Skills</h3>
                        
                        <div className="space-y-3">
                            {user.resumeUrl ? (
                                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                        📄
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-green-800">Resume Active</p>
                                        <p className="text-[10px] text-green-600 uppercase font-bold">PDF Uploaded</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                    <p className="text-xs text-gray-400 font-medium">No resume uploaded</p>
                                </div>
                            )}

                            <input
                                type="file"
                                id="resume-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleResumeUpload}
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="resume-upload"
                                className={`flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all ${isLoading ? 'opacity-50' : ''}`}
                            >
                                {user.resumeUrl ? 'Update Resume' : 'Upload Resume'}
                            </label>
                        </div>

                        {user.skills && user.skills.length > 0 && (
                            <div className="pt-4 space-y-3">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Extracted Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill) => (
                                        <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                <Card className="md:col-span-2 p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {user?.role === 'student' && (
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-bold text-indigo-900 text-sm">Your Public Portfolio is Live! 🚀</h3>
                                    <p className="text-indigo-700 text-xs mt-1">Share this link with recruiters to showcase your verified skills and rank.</p>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <input 
                                        readOnly 
                                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/portfolio/${user.username || user.name.replace(/\s+/g, '').toLowerCase()}`}
                                        className="bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-xs text-indigo-600 font-medium flex-1 md:w-64 outline-none"
                                    />
                                    <a 
                                        href={`/portfolio/${user.username || user.name.replace(/\s+/g, '').toLowerCase()}`} 
                                        target="_blank"
                                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shrink-0"
                                    >
                                        View
                                    </a>
                                </div>
                            </div>
                        )}

                        {message.text && (
                            <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                            <Input label="Username" name="username" value={formData.username} onChange={handleChange} placeholder="e.g. naveenkm07" />
                            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                            <Input label="Department" name="department" value={formData.department} onChange={handleChange} />
                            <Input label="Roll Number" name="rollNumber" value={formData.rollNumber} onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Professional Summary</label>
                            <textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                placeholder="Describe your professional background..."
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Social Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="GitHub URL" name="social-github" value={formData.socialLinks.github} onChange={handleChange} />
                                <Input label="LinkedIn URL" name="social-linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" isLoading={isLoading} className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}
