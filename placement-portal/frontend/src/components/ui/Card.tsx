import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Reusable Card component with glassmorphism-inspired styling.
 */
export const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100
        ${paddingStyles[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
};
