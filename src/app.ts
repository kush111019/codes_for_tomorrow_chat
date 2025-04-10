import express from "express";
import cookieParser from "cookie-parser";
import authRoutes  from "./routes/auth.routes";
import { AppDataSource } from "./config/data.source" ;


import dotenv from "dotenv";
dotenv.config();

const app = express() ;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);

AppDataSource.initialize()
.then(()=>console.log("DB is connected"))
.catch((err)=>console.log("DB error",err));

export default app ;

