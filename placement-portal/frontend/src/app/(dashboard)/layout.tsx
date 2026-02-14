'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Spinner } from '@/components/ui/Spinner';

/**
 * Protected Dashboard Layout.
 *
 * Security logic:
 * 1. Check if auth state is loading → show spinner
 * 2. If not authenticated → redirect to /login
 * 3. If authenticated → render sidebar + navbar + page content
 *
 * All routes inside (dashboard)/ are automatically protected.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading spinner during auth check
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    // Don't render anything if not authenticated (redirect is in progress)
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6 animate-fade-in">{children}</main>
                <Footer />
            </div>
        </div>
    );
}
