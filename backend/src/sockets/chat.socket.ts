import { Server, Socket } from "socket.io";
import Message from "../models/Message.js";

type JoinPayload = { postId: string };
type SendPayload = {
  postId: string;
  text: string;
  userId: string;
  username: string;
  parentId?: string | null;
};

export function registerChatNamespace(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on("join_post", ({ postId }: JoinPayload) => {
      socket.join(postId);
    });

    socket.on("send_message", async ({ postId, text, userId, username, parentId }: SendPayload) => {
      try {
        if (!text?.trim()) return;

        let parentUsername: string | null = null;
        let parentText: string | null = null;

        if (parentId) {
          // try fetch parent to show quick preview
          const parent = await Message.findById(parentId).lean();
          if (parent) {
            parentUsername = parent.username ?? null;
            parentText = typeof parent.text === "string" ? parent.text.slice(0, 300) : null;
          }
        }

        const doc = await Message.create({
          postId,
          userId,
          username,
          text,
          parentId: parentId || null,
          parentUsername,
          parentText
        });

        io.to(postId).emit("receive_message", {
          _id: doc._id,
          postId: doc.postId,
          userId: doc.userId,
          username: doc.username,
          text: doc.text,
          parentId: doc.parentId,
          parentUsername: doc.parentUsername,
          parentText: doc.parentText,
          createdAt: doc.createdAt
        });
      } catch (err) {
        console.error("send_message err:", err);
      }
    });
  });
}
