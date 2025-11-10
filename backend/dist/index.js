import express, {} from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { serverConfig } from './config/index.js';
import { connectDB } from './config/db.js';
import authRouter from './router/authRouter.js';
//import { seedUser } from './seeders/seed.js';
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.get('/health', (_req, res) => {
    res.json({
        ok: true
    });
});
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    socket.on('disconnect', () => {
        console.log('a user disconnected', socket.id);
    });
});
server.listen(serverConfig.port, async () => {
    console.log(`server is running on ${serverConfig.port}`);
    await connectDB();
    //await seedUser()
});
//# sourceMappingURL=index.js.map