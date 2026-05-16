import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';
import { env } from '../config/env';

let io: SocketIOServer;

export const initSocket = (server: Server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: env.CLIENT_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // A client can join a room named after their userId
        socket.on('join', (userId: string) => {
            socket.join(userId);
            console.log(`Socket ${socket.id} joined room ${userId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
