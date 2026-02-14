import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file before anything else
dotenv.config();

/**
 * Environment variable schema — validated at startup.
 * If any required variable is missing, the app will crash immediately
 * with a clear error message instead of failing silently later.
 */
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(5000),

    // MongoDB
    MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

    // JWT
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),

    // SMTP
    SMTP_HOST: z.string().default('smtp.gmail.com'),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_EMAIL: z.string().email('SMTP_EMAIL must be a valid email'),
    SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),

    // Client
    CLIENT_URL: z.string().url().default('http://localhost:3000'),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes
    RATE_LIMIT_MAX: z.coerce.number().default(100),
    OTP_RATE_LIMIT_MAX: z.coerce.number().default(5),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
