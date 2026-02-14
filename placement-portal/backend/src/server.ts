import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';
import { verifyEmailConnection } from './services/email.service';

/**
 * Server entry point.
 *
 * Startup sequence:
 * 1. Connect to MongoDB Atlas
 * 2. Verify SMTP connection (optional — warns but doesn't block)
 * 3. Start Express server
 * 4. Handle graceful shutdown on SIGTERM/SIGINT
 */
const startServer = async (): Promise<void> => {
    try {
        // 1. Connect to database
        await connectDB();

        // 2. Verify email configuration (non-blocking)
        await verifyEmailConnection();

        // 3. Start HTTP server
        const server = app.listen(env.PORT, () => {
            logger.info(`
  =====================================================
  🚀 Server running in ${env.NODE_ENV} mode
  📡 Port: ${env.PORT}
  🔗 URL: http://localhost:${env.PORT}
  📋 API: http://localhost:${env.PORT}/api/health
  =====================================================
      `);
        });

        // 4. Graceful shutdown handlers
        const gracefulShutdown = (signal: string) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);
            server.close(() => {
                logger.info('HTTP server closed');
                process.exit(0);
            });

            // Force shutdown after 30 seconds
            setTimeout(() => {
                logger.error('Forced shutdown — timeout exceeded');
                process.exit(1);
            }, 30000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason: Error) => {
            logger.error('Unhandled Rejection:', reason);
            // In production, let the process manager restart
            gracefulShutdown('UNHANDLED_REJECTION');
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception:', error);
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
