import mongoose from 'mongoose'
import { serverConfig } from './index.js';

export async function connectDB() {
    
    try{
        await mongoose.connect(serverConfig.mongo_uri);


        mongoose.connection.on("error",(err:Error)=>{
            console.error("MongoDB connection error",err);
        });

        mongoose.connection.on("disconnected",(err:Error)=>{
            console.error("MongoDB disconnected",err);
        });

        process.on("SIGINT",async ()=>{
            await mongoose.connection.close();
            console.info("mongoDB connection closed");
            process.exit(0);  // 0 -> success signal
        })

        console.log("monogdb connected");
    }catch(error){
        console.log(error)
        process.exit(1)   // 1 -> error dignal
    }
}