import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

/**
 * Reusable Input component with label, error, and helper text.
 */
export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
          ${className}
        `}
                {...props}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
    );
};
