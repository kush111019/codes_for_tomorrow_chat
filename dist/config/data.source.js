"use strict";
// // import { DataSource } from 'typeorm' ;
// // import 'reflect-metadata';
// // import { User } from "../entities/User" ;
// // require('dotenv').config();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// // export const AppDataSource = new DataSource({
// //     type: "mysql",
// //     host: process.env.DB_HOST ,
// //     port: Number(process.env.DB_PORT) ,
// //     username: process.env.DB_USERNAME ,
// //     password: process.env.DB_PASSWORD ,
// //     database: process.env.DB_NAME ,
// //     synchronize: false ,
// //     entities: ['dist/entities/**/*.ts'],
// //     migrations: ['dist/migrations/**/*.ts'],
// //     subscribers: [],
// //     logging: true,
// // });
// // AppDataSource.initialize()
// // .then(()=>console.log("Database connected"))
// // .catch((err)=>console.log("Database connection err ",err))
const typeorm_1 = require("typeorm");
require("reflect-metadata");
require('dotenv').config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: ['src/entities/**/*.ts'], // 👈 this is the fix
    migrations: ['src/migrations/**/*.ts'], // 👈 this is the fix
    subscribers: [],
    logging: true,
});
exports.AppDataSource.initialize()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Database connection err ", err));
// import { DataSource} from "typeorm";
// import dotenv from "dotenv";
// import { User } from "../entities/User";
// dotenv.config();
// export const AppDataSource = new DataSource({
//     type: "mysql",
//     host: process.env.DATABASE_HOST || "localhost",
//     port: Number(process.env.DATABASE_PORT) || 3306,
//     username: process.env.DATABASE_USER || "root",
//     password: process.env.DATABASE_PASSWORD || "Takkupulto22@",
//     database: process.env.DATABASE_NAME || "mydb",
//     synchronize: true,
//     logging: false,
//     entities: [User],
//     migrations: ["src/migrations/*.ts"],
//     subscribers: []
// });
// AppDataSource.initialize()
//     .then(() => console.log("Database connected"))
//     .catch((err) => console.error("Database connection error", err));
