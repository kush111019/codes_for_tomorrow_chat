import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import { AppDataSource } from "../src/config/data.source";
import cors from "cors";
import { registerSocket } from "./sockets/socket";
import app from "./app"
import dotenv from "dotenv";
import session from "express-session";
import { cache } from "./utils/cache";

dotenv.config();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const socketMap = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("register", (userId: number) => {
    socketMap.set(userId.toString(), socket.id);
    console.log("Registered socket for User:", userId);
  });

  socket.on("joinRoom", (roomName: string) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room: ${roomName}`);
  });

  socket.on("sendMessageToRoom", ({ roomName, message }) => {
    console.log(`Message from ${socket.id} to room ${roomName}: ${message}`);
    io.to(roomName).emit("receiveMessage", {
      senderId: socket.id,
      message,
    });
  });

  socket.on("sendNotification", (userId: string, message: string) => {
    const userSocketId = socketMap.get(userId);
    if (userSocketId) {
      io.to(userSocketId).emit("receive-notification", message);
      console.log(`Notification sent to User ${userId}`);
    }
  });

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

app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "sessionsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  })
);

registerSocket(io);

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
    httpServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => {
    console.log("Database connection error: ", error);
  });

export { app, httpServer, io, cache, socketMap };



