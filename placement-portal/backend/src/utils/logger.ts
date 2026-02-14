import winston from 'winston';
import { env } from '../config/env';

/**
 * Application logger using Winston.
 * - Development: colorized console output with full stack traces
 * - Production: JSON format for structured log aggregation (ELK, Datadog, etc.)
 */
const logFormat = env.NODE_ENV === 'production'
    ? winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
    )
    : winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} ${level}: ${stack || message}`;
        }),
    );

export const logger = winston.createLogger({
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'placement-portal-api' },
    transports: [
        new winston.transports.Console(),
        // In production, add file transports or external log services
        ...(env.NODE_ENV === 'production'
            ? [
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' }),
            ]
            : []),
    ],
});
