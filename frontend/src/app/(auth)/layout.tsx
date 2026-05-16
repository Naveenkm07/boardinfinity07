/**
 * Auth layout — minimal layout for login pages (no sidebar/navbar).
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {children}
        </div>
    );
}
