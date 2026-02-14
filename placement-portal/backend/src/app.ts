import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';
import { env } from './config/env';

/**
 * Express application setup.
 *
 * Middleware order matters:
 * 1. Helmet — security headers (CSP, HSTS, X-Frame-Options, etc.)
 * 2. CORS — allow cross-origin requests from CLIENT_URL only
 * 3. Rate limiter — prevent DDoS and brute-force attacks
 * 4. Morgan — HTTP request logging
 * 5. Body parsers — JSON and URL-encoded body parsing
 * 6. Routes — all API routes
 * 7. Error handler — catch-all error handler (MUST be last)
 */
const app = express();

// ─── Security Middleware ────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.use(globalRateLimiter);

// ─── Request Logging ────────────────────────────────────────
// 'combined' format in production for full access logs
// 'dev' format in development for colorized concise output
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Body Parsing ───────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── API Routes ─────────────────────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// ─── Global Error Handler (must be last) ────────────────────
app.use(errorHandler);

export default app;
