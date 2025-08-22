import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { errorHandler } from "./middlewares/error.js";
import path from "path"; 
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/auth", authRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/messages", messageRoutes);

    //  Serve frontend build 
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  app.use(errorHandler);
  return app;
};
