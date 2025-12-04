import { Server } from "socket.io";
import { prisma } from "./prisma/prisma-client";

export const io = new Server(3001,{
  cors: {
    origin: "*",
  }
})

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("message", async (msg) => {
    console.log("message received:", msg);   
    const chat = await prisma.chat.create({
      data: {
        message: msg,
      },
    });
    io.emit("message", chat);
  }); 

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });

})

console.log("run server http://localhost:3000");
