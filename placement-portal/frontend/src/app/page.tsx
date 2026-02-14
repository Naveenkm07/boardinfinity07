'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { UserRole } from '@/types';

/**
 * Root page — redirects to appropriate dashboard based on role,
 * or to login if not authenticated.
 */
export default function HomePage() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated && user) {
                // Redirect based on role
                router.replace(user.role === UserRole.ADMIN ? '/admin' : '/student');
            } else {
                router.replace('/login');
            }
        }
    }, [isAuthenticated, isLoading, user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    );
}
