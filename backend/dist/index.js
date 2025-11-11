import express, {} from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { authConfig, serverConfig } from './config/index.js';
import { connectDB } from './config/db.js';
import authRouter from './router/authRouter.js';
import User from './models/User.js';
import { Membership } from './models/Membership.js';
import { Message } from './models/Message.js';
//import { seedUser } from './seeders/seed.js';
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.get('/health', (_req, res) => {
    res.json({
        ok: true
    });
});
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Auth Error'));
    }
    try {
        const decoded = jwt.verify(token, authConfig.JWT_SECRET);
        const userId = decoded.userId || decoded.id || decoded.sub;
        if (!userId)
            throw new Error('Invalid token payload');
        // @ts-ignore
        socket.userId = userId;
        next();
    }
    catch (err) {
        next(new Error('Authentication failed'));
    }
});
io.on('connection', async (socket) => {
    try {
        // @ts-ignore
        const userId = socket.userId;
        let userEmail = null;
        if (userId) {
            const user = await User.findById(userId).select('email');
            userEmail = user ? user.email : null;
        }
        console.log('a user connected', socket.id, userEmail);
        socket.on('join-room', async ({ roomId }) => {
            try {
                if (!roomId) {
                    socket.emit('error', { message: 'roomId is required' });
                    return;
                }
                const membership = await Membership.findOne({
                    userId: userId,
                    roomId: roomId
                });
                if (!membership) {
                    socket.emit('error', { message: 'Access denied to this room' });
                    return;
                }
                const roomName = `room:${roomId}`;
                socket.join(roomName);
                console.log(`User ${userId} joined ${roomName}`);
                io.to(roomName).emit('user-joined', {
                    userId,
                    roomId
                });
            }
            catch (error) {
                console.log('error in join room', error);
                socket.emit('error', { message: 'Failed to join room' });
            }
        });
        socket.on('send-message', async ({ roomId, content }) => {
            try {
                if (!roomId) {
                    socket.emit('error', { message: 'roomId is required' });
                    return;
                }
                const membership = await Membership.findOne({
                    userId: userId,
                    roomId: roomId
                });
                if (!membership) {
                    socket.emit('error', { message: 'Access denied to this room' });
                    return;
                }
                if (!content) {
                    socket.emit('error', { message: 'there is not content in the message' });
                    return;
                }
                // @ts-ignore
                const savedMessage = await Message.create({ content, senderId: socket.userId, roomId });
                console.log('Message is', savedMessage);
                io.to('room:' + roomId).emit('new-message', savedMessage);
            }
            catch (error) {
                console.log('Error in send message', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });
        socket.on('leave-room', async ({ roomId }) => {
            try {
                if (!roomId) {
                    socket.emit('error', { message: 'roomId is required' });
                    return;
                }
                const roomName = `room:${roomId}`;
                socket.leave(roomName);
                console.log(`User ${userId} left ${roomName}`);
                io.to(roomName).emit('user-left', {
                    userId, roomId
                });
            }
            catch (error) {
                console.log('error in leave room', error);
                socket.emit('error', { message: 'Failed to leave room' });
            }
        });
        socket.on('connect_error', (error) => {
            if (error.message === 'Authentication error') {
                console.log('Invalid token,please login again');
            }
        });
        socket.on('disconnect', () => {
            console.log('a user disconnected', socket.id, userEmail);
        });
    }
    catch (error) {
        console.error('Error handling connection:', error);
    }
});
await connectDB();
server.listen(serverConfig.port, async () => {
    console.log(`server is running on ${serverConfig.port}`);
    //await seedUser()
});
//# sourceMappingURL=index.js.map