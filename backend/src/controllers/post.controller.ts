import { Request, Response } from "express";
import { StatusCodes as S } from "http-status-codes";
import Post, { IPost } from "../models/Post.js";
import { AuthRequest } from "../middlewares/auth.js";

// Create a new post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(S.UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(S.BAD_REQUEST).json({ error: "Content cannot be empty" });
    }

    const post: IPost = await Post.create({
      content,
      createdBy: req.user.id, // req.user comes from requireAuth middleware
    });

    res.status(S.CREATED).json(post);
  } catch (err: any) {
    console.error("createPost error:", err);
    res.status(S.INTERNAL_SERVER_ERROR).json({ error: err.message || "Internal server error" });
  }
};

// List all posts
export const listPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err: any) {
    console.error("listPosts error:", err);
    res.status(S.INTERNAL_SERVER_ERROR).json({ error: err.message || "Internal server error" });
  }
};

// Get a single post by ID
export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate("createdBy", "username");
    if (!post) {
      return res.status(S.NOT_FOUND).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err: any) {
    console.error("getPost error:", err);
    res.status(S.INTERNAL_SERVER_ERROR).json({ error: err.message || "Internal server error" });
  }
};
