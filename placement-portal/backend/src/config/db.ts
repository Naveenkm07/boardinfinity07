import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

/**
 * Connect to MongoDB Atlas with retry logic.
 * Mongoose handles connection pooling internally.
 */
export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(env.MONGO_URI, {
            // Connection pool size — suitable for 10k+ concurrent users
            maxPoolSize: 50,
            // Server selection timeout
            serverSelectionTimeoutMS: 5000,
            // Socket timeout
            socketTimeoutMS: 45000,
        });

        logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });
    } catch (error) {
        logger.error('❌ MongoDB connection failed:', error);
        // Exit process with failure — let process manager (PM2/Docker) restart
        process.exit(1);
    }
};
