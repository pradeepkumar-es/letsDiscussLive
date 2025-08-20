import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { registerChatNamespace } from "./sockets/chat.socket.js";

dotenv.config();

const start = async () => {
  await connectDB(process.env.MONGO_URI!);

  const app = createApp();
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN, credentials: true }
  });
  registerChatNamespace(io);

  const port = Number(process.env.PORT) || 5000;
  httpServer.listen(port, () => console.log(`LetsDiscussLive is running on :${port}`));
};
start();
