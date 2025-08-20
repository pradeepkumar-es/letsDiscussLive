import { Request, Response } from "express";
import Message from "../models/Message.js";

export const listMessages = async (req: Request, res: Response) => {
  const { id: postId } = req.params;
  const messages = await Message.find({ postId }).sort({ createdAt: 1 }).limit(500).lean();
  res.json(messages);
};
