/**
 * Application-wide constants.
 * Centralizing magic numbers and strings here keeps the codebase maintainable.
 */
export const CONSTANTS = {
    // OTP Configuration
    OTP_LENGTH: 6,
    OTP_EXPIRY_MINUTES: 10,
    OTP_MAX_ATTEMPTS: 5,

    // JWT
    JWT_COOKIE_NAME: 'auth_token',

    // Pagination defaults
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,

    // User roles
    ROLES: {
        STUDENT: 'student' as const,
        ADMIN: 'admin' as const,
    },
} as const;
