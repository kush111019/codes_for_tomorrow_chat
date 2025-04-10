"use strict";
// import { Server, Socket } from "socket.io";
Object.defineProperty(exports, "__esModule", { value: true });
// export const registerSocket = (io: Server) => {
//   io.on("connection", (socket: Socket) => {
//     console.log("New client connected:", socket.id);
//     socket.on("register", (email: string) => {
//       console.log("Registered socket for:", email);
//       // Store socket ID by email if necessary (can be done with a Map or Database)
//     });
//     socket.on("disconnect", () => {
//       console.log("Client disconnected:", socket.id);
//     });
//     // Room handling: Join a room
//     socket.on("joinRoom", (room: string) => {
//       socket.join(room);  // Join the room
//       console.log(`${socket.id} joined room: ${room}`);
//       socket.to(room).emit("message", `User ${socket.id} joined room: ${room}`);
//     });
//     // Send a message to a specific room
//     socket.on("sendMessageToRoom", (data: { roomName: string, message: string }) => {
//       const { roomName, message } = data;
//       console.log(`Message sent to room ${roomName}: ${message}`);
//       socket.to(roomName).emit("receiveMessage", {
//         senderId: socket.id,
//         message: message,
//       });
//     });
//     // Send notifications to specific users
//     socket.on("sendNotification", (targetUserId: number, message: string) => {
//       console.log(`Notification sent to User ${targetUserId}: ${message}`);
//       // Emit to the user (you could implement logic to check which socket is associated with the user)
//       io.emit("receive-notification", { userId: targetUserId, message });
//     });
//   });
// };
var io = require("socket.io-client");
var readline = require("readline");
// // Create a readline interface to capture user input from the terminal
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
// rl.question("Enter your user ID: ", (userId: string) => { // userId is treated as a string here
//   const socket = io("http://localhost:5000", {
//     transports: ["websocket"]
//   });
//   socket.on("connect", () => {
//     const numericUserId = Number(userId); // Convert userId to a number
//     console.log(`Connected to WebSocket Server as User ${numericUserId}`);
//     socket.emit("register", numericUserId);  // Register the user when they connect
//   });
//   // Listen for messages from the server
//   socket.on("message", (data) => {
//     console.log(`Received message: ${data}`);
//   });
//   // Allow the user to send messages dynamically
//   rl.question("Enter room to join: ", (room) => {
//     socket.emit("joinRoom", room);  // Join a specific room
//     // Ask for custom message
//     rl.question("Enter a custom message to send to the room: ", (message) => {
//       socket.emit("sendMessage", { room, message });  // Send the custom message to the room
//       // Close the readline interface after sending the message
//       rl.close();
//     });
//   });
//   // Handling disconnection
//   socket.on("disconnect", () => {
//     console.log("Disconnected from server.");
//   });
// });
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Enter your user ID: ", function (userId) {
    var socket = io("http://localhost:5000", {
        transports: ["websocket"]
    });
    socket.on("connect", function () {
        var numericUserId = Number(userId); // Convert userId to a number
        console.log("Connected to WebSocket Server as User ".concat(numericUserId));
        socket.emit("register", numericUserId); // Register the user when they connect
    });
    // Listen for messages from the server
    socket.on("message", function (data) {
        console.log("Received message: ".concat(data));
    });
    // Function to send a custom message
    var sendMessageToRoom = function (room) {
        rl.question("Enter a custom message to send to the room: ", function (message) {
            socket.emit("sendMessage", { room: room, message: message }); // Send the custom message to the room
            console.log("Message sent to room ".concat(room, ": ").concat(message));
            // Ask again for another message
            sendMessageToRoom(room); // Loop to ask for next message
        });
    };
    // Join the room and continuously prompt for messages
    rl.question("Enter room to join: ", function (room) {
        socket.emit("joinRoom", room); // Join a specific room
        console.log("Joined room: ".concat(room));
        // Start sending messages in the loop
        sendMessageToRoom(room); // First message prompt
    });
    // Handling disconnection
    socket.on("disconnect", function () {
        console.log("Disconnected from server.");
    });
});
