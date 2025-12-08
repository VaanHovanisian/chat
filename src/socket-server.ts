import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { prisma } from "./prisma/prismaclient";

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

    socket.on("message", async (text) => {
      const msg = {
        id: Date.now(),
        text,
      };

      await prisma.chat.create({
        data: {
          message: text,
        },
      });

      io.emit("message", msg);
    });

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected", socket.id, reason);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
