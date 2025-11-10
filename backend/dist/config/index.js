import dotenv from 'dotenv';
function loadEnv() {
    dotenv.config();
    console.log("Env variables loaded");
}
loadEnv();
export const authConfig = {
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'chat_socket',
    JWT_ISSUER: process.env.JWT_ISSUER || 'chats',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '10d',
    JWT_SECRET: process.env.JWT_SECRET || 'trishit'
};
export const serverConfig = {
    port: Number(process.env.PORT),
    mongo_uri: process.env.MONGO_URI || 'mongodb://localhost:27017/chats'
};
//# sourceMappingURL=index.js.map