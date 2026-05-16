/**
 * Utility helper functions.
 */

import { type ClassValue, clsx } from 'clsx';

/**
 * Conditionally join class names (simple implementation without clsx dependency).
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
    return inputs.filter(Boolean).join(' ');
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}
