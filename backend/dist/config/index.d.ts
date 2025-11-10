type ServerConfig = {
    port: number;
    mongo_uri: string;
};
type AuthConfig = {
    JWT_AUDIENCE: string;
    JWT_ISSUER: string;
    JWT_EXPIRES_IN: string;
    JWT_SECRET: string;
};
export declare const authConfig: AuthConfig;
export declare const serverConfig: ServerConfig;
export {};
//# sourceMappingURL=index.d.ts.map