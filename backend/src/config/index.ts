import dotenv from 'dotenv';

type ServerConfig ={
    port:number,
    mongo_uri:string

}

type AuthConfig = {
    JWT_AUDIENCE:string,
    JWT_ISSUER:string,
    JWT_EXPIRES_IN:string,
    JWT_SECRET:string,
}

function loadEnv(){
    dotenv.config();
    console.log("Env variables loaded");
}

loadEnv();

export const authConfig:AuthConfig = {
    JWT_AUDIENCE:process.env.JWT_AUDIENCE || 'chat_socket', 
    JWT_ISSUER:process.env.JWT_ISSUER || 'chats',
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN ||'10d',
    JWT_SECRET:process.env.JWT_SECRET ||'trishit'

}


export const serverConfig:ServerConfig={
    port:Number(process.env.PORT),
    mongo_uri:process.env.MONGO_URI ||'mongodb://localhost:27017/chats'
}


