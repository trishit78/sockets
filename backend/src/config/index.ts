import dotenv from 'dotenv';

type ServerConfig ={
    port:number,
    mongo_uri:string

}


function loadEnv(){
    dotenv.config();
    console.log("Env variables loaded");
}

loadEnv();

export const serverConfig:ServerConfig={
    port:Number(process.env.PORT),
    mongo_uri:process.env.MONGO_URI ||'mongodb://localhost:27017/chats'
}


