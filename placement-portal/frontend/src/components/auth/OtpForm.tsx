'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface OtpFormProps {
    email: string;
    onSubmit: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
}

/**
 * OTP input form — Step 2 of the login flow.
 * User enters the 6-digit OTP received via email.
 */
export const OtpForm: React.FC<OtpFormProps> = ({
    email,
    onSubmit,
    onResend,
    onBack,
    isLoading,
    error,
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const [resendCooldown, setResendCooldown] = useState(30);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend button
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Auto-focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only last character
        setOtp(newOtp);

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Backspace — go to previous input
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length === 6) {
            await onSubmit(otpString);
        }
    };

    const handleResend = async () => {
        await onResend();
        setResendCooldown(30);
        setOtp(new Array(6).fill(''));
        inputRefs.current[0]?.focus();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <span className="text-3xl">📧</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
                <p className="text-gray-500 mt-2">
                    We sent a code to <span className="font-medium text-gray-700">{email}</span>
                </p>
            </div>

            {/* OTP Input Boxes */}
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`
              w-12 h-14 text-center text-xl font-bold rounded-lg border-2
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}
            `}
                    />
                ))}
            </div>

            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={otp.join('').length !== 6}
            >
                Verify OTP
            </Button>

            <div className="flex items-center justify-between text-sm">
                <button
                    type="button"
                    onClick={onBack}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                    ← Change email
                </button>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className={`
            transition-colors
            ${resendCooldown > 0
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-primary-600 hover:text-primary-700'}
          `}
                >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </button>
            </div>
        </form>
    );
};
