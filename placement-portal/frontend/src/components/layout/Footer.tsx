import React from 'react';

/**
 * Footer component.
 */
export const Footer: React.FC = () => {
    return (
        <footer className="py-4 px-6 border-t border-gray-200 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm text-gray-500">
                <p>© {new Date().getFullYear()} College Placement Portal. All rights reserved.</p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
                </div>
            </div>
        </footer>
    );
};
