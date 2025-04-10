"use strict";
// import { createServer} from "http" ;
// import express from "express";
// import {Server} from "socket.io";
// import app from "./app";
// import cookieParser from "cookie-parser";
// import { AppDataSource } from "../src/config/data.source";
// import cors from "cors";
// import{registerSocket} from "./sockets/socket";
// import dotenv from "dotenv";
// import http from "http";
// import session from "express-session";
// import { cache } from "./utils/cache";
// dotenv.config();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketMap = exports.cache = exports.io = exports.httpServer = exports.app = void 0;
// const httpServer = createServer(app);
// const io = new Server(httpServer ,{
//     cors:{
//         origin:"*",
//     },
// });
// const socketMap = new Map<string, string>();
// io.on("connection", (socket) => {
//     console.log("New client connected:", socket.id);
//     socket.on("register", (email: string) => {
//       socketMap.set(email, socket.id);
//       console.log("Registered socket for:", email);
//     });
//     socket.on("disconnect", () => {
//       for (const [email, socketId] of socketMap.entries()) {
//         if (socketId === socket.id) {
//           socketMap.delete(email);
//           break;
//         }
//       }
//       console.log("Client disconnected:", socket.id);
//     });
//   });
//   app.use(cookieParser());
//   app.use(cors({ origin: "*", credentials: true}));
//   app.use(express.json());
//   app.use(cookieParser());
//   app.use(session({
//     secret: "your-secret-key", 
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         maxAge: 60 * 60 * 1000, // 1 hour
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//       }
// }));
// registerSocket(io);
// //httpServer.listen(5000 , ()=> console.log("Server running on http://localhost:5000"));
// const PORT = process.env.PORT || 5000;
// AppDataSource.initialize().then(() => {
//     console.log("Database connected successfully");
//     httpServer.listen(PORT, () => {
//         console.log(`Server running on http://localhost:${PORT}`);
//     });
// }).catch((error: any) => {
//     console.log("Database connections error: ",error);
// })
// export { app, httpServer, io, cache, socketMap };
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const data_source_1 = require("../src/config/data.source");
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./sockets/socket");
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const cache_1 = require("./utils/cache");
Object.defineProperty(exports, "cache", { enumerable: true, get: function () { return cache_1.cache; } });
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
    },
});
exports.io = io;
const socketMap = new Map();
exports.socketMap = socketMap;
// Handle Socket.IO connections
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    // Register user by user ID and store the socket id
    socket.on("register", (userId) => {
        socketMap.set(userId.toString(), socket.id);
        console.log("Registered socket for User:", userId);
    });
    // Listen to "joinRoom" event to add clients to a room
    socket.on("joinRoom", (roomName) => {
        socket.join(roomName);
        console.log(`${socket.id} joined room: ${roomName}`);
    });
    // Listen for messages and broadcast them to clients in the room
    socket.on("sendMessageToRoom", ({ roomName, message }) => {
        console.log(`Message from ${socket.id} to room ${roomName}: ${message}`);
        io.to(roomName).emit("receiveMessage", {
            senderId: socket.id,
            message,
        });
    });
    // Listen to send notifications
    socket.on("sendNotification", (userId, message) => {
        const userSocketId = socketMap.get(userId);
        if (userSocketId) {
            io.to(userSocketId).emit("receive-notification", message);
            console.log(`Notification sent to User ${userId}`);
        }
    });
    // Handle disconnection
    socket.on("disconnect", () => {
        for (const [userId, socketId] of socketMap.entries()) {
            if (socketId === socket.id) {
                socketMap.delete(userId);
                break;
            }
        }
        console.log("Client disconnected:", socket.id);
    });
});
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: "*", credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 hour
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    },
}));
(0, socket_1.registerSocket)(io);
// Database initialization and server start
const PORT = process.env.PORT || 5000;
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected successfully");
    httpServer.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.log("Database connection error: ", error);
});
