'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface EmailFormProps {
    onSubmit: (email: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

/**
 * Email input form — Step 1 of the login flow.
 * User enters their email to receive an OTP.
 */
export const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, isLoading, error }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            await onSubmit(email.trim().toLowerCase());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <span className="text-3xl">🎓</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-500 mt-2">Sign in to the College Placement Portal</p>
            </div>

            <Input
                label="Email Address"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error || undefined}
                required
                autoFocus
                autoComplete="email"
            />

            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
            >
                Send OTP
            </Button>

            <p className="text-center text-sm text-gray-500">
                We&apos;ll send a 6-digit code to your email
            </p>
        </form>
    );
};
