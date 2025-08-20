import { Router } from "express";
import { createPost, getPost, listPosts } from "../controllers/post.controller.js";
import { requireAuth } from "../middlewares/auth.js";
const r = Router();
r.get("/", listPosts);
r.get("/:id", getPost);
r.post("/", requireAuth, createPost);
export default r;
