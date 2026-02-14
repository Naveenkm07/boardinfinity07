import { CorsOptions } from 'cors';
import { env } from './env';

/**
 * CORS configuration — only allows requests from the frontend origin.
 * In production, CLIENT_URL should be set to the Vercel deployment URL.
 */
export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [env.CLIENT_URL];

        // Allow requests with no origin (mobile apps, server-to-server, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
