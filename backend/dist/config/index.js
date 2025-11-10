import dotenv from 'dotenv';
function loadEnv() {
    dotenv.config();
    console.log("Env variables loaded");
}
loadEnv();
export const serverConfig = {
    port: Number(process.env.PORT),
    mongo_uri: process.env.MONGO_URI || 'mongodb://localhost:27017/chats'
};
//# sourceMappingURL=index.js.map