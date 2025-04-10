"use strict";
// import { Server , Socket} from 'socket.io';
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocket = registerSocket;
function registerSocket(io) {
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        // Register the user when they provide their user ID
        socket.on('register', (userId) => {
            console.log(`Registered socket for User: ${userId}`);
            socket.join(`room-${userId}`); // Join the user to their own room
        });
        // Join a specific room
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room: ${room}`);
        });
        // Send custom message to the room
        socket.on("sendMessage", ({ room, message }) => {
            console.log(`Message to ${room}: ${message}`);
            io.to(room).emit("message", message); // Broadcast the message to everyone in the room
        });
        // Disconnect
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}
