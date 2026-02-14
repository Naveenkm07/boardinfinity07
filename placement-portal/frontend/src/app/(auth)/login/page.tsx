'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { authService } from '@/services/auth.service';
import { EmailForm } from '@/components/auth/EmailForm';
import { OtpForm } from '@/components/auth/OtpForm';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { LoginResponse, UserRole } from '@/types';

/**
 * Login Page — Two-step OTP authentication flow.
 *
 * Step 1: User enters email → OTP is sent
 * Step 2: User enters OTP → Token is returned → Redirect to dashboard
 */
export default function LoginPage() {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const { isAuthenticated, isLoading: authLoading, user, login } = useAuth();
    const { execute: executeSendOtp, isLoading: sendingOtp, error: sendOtpError } = useApi();
    const { execute: executeVerifyOtp, isLoading: verifyingOtp, error: verifyOtpError } = useApi<LoginResponse>();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            router.replace(user.role === UserRole.ADMIN ? '/admin' : '/student');
        }
    }, [isAuthenticated, user, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    /** Step 1: Send OTP to email */
    const handleSendOtp = async (emailInput: string) => {
        setEmail(emailInput);
        const result = await executeSendOtp(() => authService.sendOtp(emailInput));
        if (result?.success) {
            setStep('otp');
        }
    };

    /** Step 2: Verify OTP */
    const handleVerifyOtp = async (otp: string) => {
        const result = await executeVerifyOtp(() => authService.verifyOtp(email, otp));
        if (result?.success && result.data) {
            login(result.data.token, result.data.user);
            router.push(result.data.user.role === UserRole.ADMIN ? '/admin' : '/student');
        }
    };

    /** Resend OTP */
    const handleResendOtp = async () => {
        await executeSendOtp(() => authService.sendOtp(email));
    };

    return (
        <div className="w-full max-w-md animate-slide-up">
            <Card padding="lg" className="shadow-2xl">
                {step === 'email' ? (
                    <EmailForm onSubmit={handleSendOtp} isLoading={sendingOtp} error={sendOtpError} />
                ) : (
                    <OtpForm
                        email={email}
                        onSubmit={handleVerifyOtp}
                        onResend={handleResendOtp}
                        onBack={() => setStep('email')}
                        isLoading={verifyingOtp}
                        error={verifyOtpError}
                    />
                )}
            </Card>
        </div>
    );
}
