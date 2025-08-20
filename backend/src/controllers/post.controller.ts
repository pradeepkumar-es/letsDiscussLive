import { Request, Response } from "express";
import { StatusCodes as S } from "http-status-codes";
import Post from "../models/Post.js";

export const createPost = async (req: Request, res: Response) => {
  const post = await Post.create({ content: req.body.content, createdBy: req.user!.id });
  res.status(S.CREATED).json(post);
};

export const listPosts = async (_req: Request, res: Response) => {
  const posts = await Post.find().populate("createdBy", "username").sort({ createdAt: -1 });
  res.json(posts);
};

export const getPost = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id).populate("createdBy", "username");
  if (!post) return res.status(S.NOT_FOUND).json({ error: "Post not found" });
  res.json(post);
};
