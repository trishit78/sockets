import express, { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors'; 
import { createServer } from 'node:http';
import { Server  } from 'socket.io';
import { authConfig, serverConfig } from './config/index.js';
import { connectDB } from './config/db.js';
import authRouter from './router/authRouter.js';
import User from './models/User.js';
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
app.use('/api/auth',authRouter)

app.get('/health',(_req:Request,res:Response)=>{
    res.json({
        ok:true
    })
});

io.use(async(socket,next)=>{
    const token  = socket.handshake.auth.token;
    if (!token){
        return next(new Error('Auth Error'))
    } 
    try {
        const decoded = jwt.verify(token, authConfig.JWT_SECRET) as jwt.JwtPayload;
        const userId = decoded.userId || decoded.id || decoded.sub

        if(!userId)    throw new Error('Invalid token payload');
        // @ts-ignore
        socket.userId = userId;
            next();
    } catch (err) {
        next(new Error('Authentication failed'));
    }
})

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

        socket.on('connect_error',(error)=>{
            if(error.message === 'Authentication error'){
                console.log('Invalid token,please login again')
            }
        })

        socket.on('disconnect', () => {
            console.log('a user disconnected', socket.id,userEmail);
        });
    } catch (error) {
        console.error('Error handling connection:', error);
    }
});


await connectDB();
server.listen(serverConfig.port, async()=>{
    console.log(`server is running on ${serverConfig.port}`)
    //await seedUser()
    
})