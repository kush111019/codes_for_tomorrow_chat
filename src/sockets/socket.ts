import { Server } from 'socket.io';

export function registerSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    
    socket.on('register', (userId: number) => {
      console.log(`Registered socket for User: ${userId}`);
      socket.join(`room-${userId}`); 
    });

    socket.on('joinRoom', (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on("sendMessage", ({ room, message }: { room: string, message: string }) => {
      console.log(`Message to ${room}: ${message}`);
      io.to(room).emit("message", message);  
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}


