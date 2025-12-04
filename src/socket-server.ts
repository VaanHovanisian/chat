// // import { prisma } from "./prisma/prisma-client";
// import { Server } from "socket.io";

// export const io = new Server(3001, {
//   cors: {
//     // origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("a user connected:", socket.id);

//   socket.on("message", async (msg) => {
//     console.log("message received:", msg);
//     // const chat = await prisma.chat.create({
//     //   data: {
//     //     message: msg,
//     //   },
//     // });
//     io.emit("message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected:", socket.id);
//   });
// });

// console.log("run server http://localhost:3000");

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    socket.on("message", (text) => {
      const msg = {
        id: Date.now(),
        text,
      };

      // Посылаем всем клиентам
      io.emit("message", msg);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});

// import { createServer } from "node:http";
// import next from "next";
// import { Server } from "socket.io";

// const dev = process.env.NODE_ENV !== "production";
// const hostname = "localhost";
// const port = 3000;
// // when using middleware `hostname` and `port` must be provided below
// const app = next({ dev, hostname, port });
// const handler = app.getRequestHandler();

// app.prepare().then(() => {
//   const httpServer = createServer(handler);

//   const io = new Server(httpServer);

//   io.on("connection", (socket) => {
//     // ...
//     console.log("socket id", socket);
//   });

//   httpServer
//     .once("error", (err) => {
//       console.error(err);
//       process.exit(1);
//     })
//     .listen(port, () => {
//       console.log(`> Ready on http://${hostname}:${port}`);
//     });
// });
