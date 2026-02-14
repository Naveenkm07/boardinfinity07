import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export const metadata: Metadata = {
    title: 'College Placement Portal',
    description:
        'A comprehensive placement management platform for students and administrators. Track placements, manage applications, and connect with top companies.',
    keywords: ['placement', 'college', 'recruitment', 'jobs', 'campus hiring'],
};

/**
 * Root layout — wraps the entire application with the AuthProvider.
 * All pages inherit this layout.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
