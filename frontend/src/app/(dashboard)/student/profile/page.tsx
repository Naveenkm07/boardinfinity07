'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/user.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SkillGapAnalysisSection } from '@/components/profile/SkillGapAnalysisSection';

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        phone: '',
        department: '',
        rollNumber: '',
        bio: '',
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
                bio: user.bio || '',
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
            experience: [...prev.experience, { company: '', position: '', startDate: new Date().toISOString(), current: false, description: '' }]
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
                setUser(response.data.user);
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
                setUser(response.data.user);
                setMessage({ type: 'success', text: 'Resume uploaded and profile updated!' });
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

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                {user.username && (
                    <a 
                        href={`/portfolio/${user.username}`} 
                        target="_blank" 
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                        View Public Portfolio
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="space-y-6">
                    <Card className="p-6 text-center space-y-4">
                        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-3xl text-primary-600 font-bold">
                                {user.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase">
                                {user.role}
                            </span>
                        </div>
                        <div className="pt-4 border-t border-gray-100 text-left">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Member Since</p>
                            <p className="text-sm text-gray-700">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </Card>

                    {/* Resume Card */}
                    <Card className="p-6 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resume & Skills</h3>
                        
                        <div className="space-y-3">
                            {user.resumeUrl ? (
                                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                                    <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-green-800 truncate">Resume Uploaded</p>
                                        <p className="text-xs text-green-600">PDF Document</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                    <p className="text-xs text-gray-500">No resume uploaded yet</p>
                                </div>
                            )}

                            <div className="relative">
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
                                    className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    {user.resumeUrl ? 'Update Resume' : 'Upload Resume'}
                                </label>
                            </div>
                        </div>

                        {user.skills && user.skills.length > 0 && (
                            <div className="pt-4 space-y-2">
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Identified Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill) => (
                                        <span key={skill} className="px-2 py-1 bg-primary-50 text-primary-600 text-[10px] font-bold rounded uppercase">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Edit Form */}
                <Card className="md:col-span-2 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {message.text && (
                            <div
                                className={`p-4 rounded-lg text-sm ${
                                    message.type === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                            <Input
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="e.g. johndoe"
                                helperText="Used for your public portfolio URL"
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g. +91 9876543210"
                            />
                            <Input
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g. Computer Science"
                            />
                            <Input
                                label="Roll Number"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                placeholder="e.g. CS2024001"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                placeholder="Write a short bio about yourself..."
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 text-right">{formData.bio.length}/500</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Experience</h3>
                                <Button type="button" variant="outline" size="sm" onClick={addExperience}>+ Add</Button>
                            </div>
                            {formData.experience.map((exp, index) => (
                                <div key={index} className="p-4 border border-gray-100 rounded-xl space-y-4 bg-gray-50/30">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Company"
                                            value={exp.company}
                                            onChange={(e) => {
                                                const newExp = [...formData.experience];
                                                newExp[index].company = e.target.value;
                                                setFormData({ ...formData, experience: newExp });
                                            }}
                                            placeholder="e.g. Google"
                                        />
                                        <Input
                                            label="Position"
                                            value={exp.position}
                                            onChange={(e) => {
                                                const newExp = [...formData.experience];
                                                newExp[index].position = e.target.value;
                                                setFormData({ ...formData, experience: newExp });
                                            }}
                                            placeholder="e.g. Software Engineer"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const newExp = formData.experience.filter((_, i) => i !== index);
                                            setFormData({ ...formData, experience: newExp });
                                        }}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Education</h3>
                                <Button type="button" variant="outline" size="sm" onClick={addEducation}>+ Add</Button>
                            </div>
                            {formData.education.map((edu, index) => (
                                <div key={index} className="p-4 border border-gray-100 rounded-xl space-y-4 bg-gray-50/30">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="School/University"
                                            value={edu.school}
                                            onChange={(e) => {
                                                const newEdu = [...formData.education];
                                                newEdu[index].school = e.target.value;
                                                setFormData({ ...formData, education: newEdu });
                                            }}
                                            placeholder="e.g. MIT"
                                        />
                                        <Input
                                            label="Degree"
                                            value={edu.degree}
                                            onChange={(e) => {
                                                const newEdu = [...formData.education];
                                                newEdu[index].degree = e.target.value;
                                                setFormData({ ...formData, education: newEdu });
                                            }}
                                            placeholder="e.g. B.Tech"
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            const newEdu = formData.education.filter((_, i) => i !== index);
                                            setFormData({ ...formData, education: newEdu });
                                        }}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Social Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="GitHub Profile URL"
                                    name="social-github"
                                    value={formData.socialLinks.github}
                                    onChange={handleChange}
                                    placeholder="https://github.com/username"
                                />
                                <Input
                                    label="LinkedIn Profile URL"
                                    name="social-linkedin"
                                    value={formData.socialLinks.linkedin}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" isLoading={isLoading} className="w-full md:w-auto">
                                Save Profile Changes
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Skill Gap Analysis Section */}
            <Card className="p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xl">
                        📊
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Market Skill Gap Analysis</h2>
                        <p className="text-xs text-gray-500">AI-powered insights based on current market trends and your profile.</p>
                    </div>
                </div>
                <SkillGapAnalysisSection />
            </Card>
        </div>
    );
}
