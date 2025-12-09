import "dotenv/config";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handler(req, res));

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    socket.on("join", async ({ chatId, userId }) => {
      socket.join(chatId);
      console.log(`socket ${socket.id} joined ${chatId}`);
      // можно отправить историю:
      try {
        const messages = await prisma.message.findMany({
          where: { chatId },
          orderBy: { createdAt: "asc" },
          include: { user: true },
        });
        socket.emit("history", messages);
      } catch (err) {
        console.error("Error fetching history", err);
      }
    });

    socket.on("message", async ({ chatId, userId, text }) => {
      if (!chatId || !userId || !text) return;
      try {
        // убедись, что chat существует. Если нет — можно создать.
        const chat = await prisma.chat.findUnique({ where: { id: chatId } });
        if (!chat) {
          // создать чат автоматически (или валидировать на клиенте)
          await prisma.chat.create({ data: { id: chatId, title: null } });
        }

        const message = await prisma.message.create({
          data: {
            chatId,
            userId,
            text,
          },
          include: { user: true },
        });

        // отправить всем в комнате
        io.to(chatId).emit("message", message);
      } catch (err) {
        console.error("Save message error:", err);
        socket.emit("error", { message: "Failed to save message" });
      }
    });

    socket.on("typing", ({ chatId, userId, isTyping }) => {
      socket.to(chatId).emit("typing", { userId, isTyping });
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
