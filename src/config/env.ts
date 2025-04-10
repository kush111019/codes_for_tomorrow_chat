import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname,"../.././env")});

export const env ={
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || "5000",

    DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
    DATABASE_PORT: process.env.DATABASE_PORT || 3306,
    DATABASE_USER: process.env.DATABASE_USER || "root",
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "Takkupulto22@",
    DATABASE_NAME: "mydb",
    JWT_SECRET: process.env.JWT_SECRET || "somesecret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1H",
    SESSION_SECRET: process.env.SESSION_SECRET || "sessionsecret",
    SOCKET_PORT: Number(process.env.SOCKET_PORT) || 6000
}