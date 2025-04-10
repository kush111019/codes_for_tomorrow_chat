import * as io from "socket.io-client";
import * as readline from "readline";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter your user ID: ", (userId: string) => { 
  const socket = io("http://localhost:5000", {
    transports: ["websocket"]
  });

  socket.on("connect", () => {
    const numericUserId = Number(userId); 
    console.log(`Connected to WebSocket Server as User ${numericUserId}`);
    socket.emit("register", numericUserId); 
  });

 
  socket.on("message", (data) => {
    console.log(`Received message: ${data}`);
  });

  const sendMessageToRoom = (room: string) => {
    rl.question("Enter a custom message to send to the room: ", (message) => {
      socket.emit("sendMessage", { room, message }); 
      console.log(`Message sent to room ${room}: ${message}`);

      sendMessageToRoom(room); 
    });
  };

  rl.question("Enter room to join: ", (room) => {
    socket.emit("joinRoom", room); 
    console.log(`Joined room: ${room}`);

    sendMessageToRoom(room); 
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server.");
  });
});
