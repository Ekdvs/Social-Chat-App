import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initIO = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token"));
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId); // personal room

    socket.on("joinChat", (chatId) => socket.join(`chat:${chatId}`));

    socket.on("typing", (chatId) => socket.to(`chat:${chatId}`).emit("typing", { chatId, userId: socket.userId }));
    socket.on("stopTyping", (chatId) => socket.to(`chat:${chatId}`).emit("stopTyping", { chatId, userId: socket.userId }));

    socket.on("newMessage", ({ chatId, message }) => {
      io.to(`chat:${chatId}`).emit("messageReceived", { chatId, message });
    });

    socket.on("seen", ({ chatId, userId }) => {
      socket.to(`chat:${chatId}`).emit("seen", { chatId, userId });
    });
  });

  return io;
};
