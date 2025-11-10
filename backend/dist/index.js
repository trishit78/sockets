import express, {} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
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
server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
//# sourceMappingURL=index.js.map