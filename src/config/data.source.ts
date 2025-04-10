// import { DataSource } from 'typeorm' ;
// import 'reflect-metadata';
// import { User } from "../entities/User" ;
// require('dotenv').config();


// export const AppDataSource = new DataSource({
//     type: "mysql",
//     host: process.env.DB_HOST ,
//     port: Number(process.env.DB_PORT) ,
//     username: process.env.DB_USERNAME ,
//     password: process.env.DB_PASSWORD ,
//     database: process.env.DB_NAME ,
//     synchronize: false ,
//     entities: ['dist/entities/**/*.ts'],
//     migrations: ['dist/migrations/**/*.ts'],
//     subscribers: [],
//     logging: true,
// });

// AppDataSource.initialize()
// .then(()=>console.log("Database connected"))
// .catch((err)=>console.log("Database connection err ",err))



import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { User } from '../entities/User'; // Import direct if needed for runtime
require('dotenv').config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ['src/entities/**/*.ts'], 
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  logging: true,
});

AppDataSource.initialize()
.then(()=>console.log("Database connected"))
.catch((err)=>console.log("Database connection err ",err))



