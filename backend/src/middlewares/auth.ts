import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies[process.env.COOKIE_NAME as string];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const payload = verifyJwt<{ id: string; username: string }>(token, process.env.JWT_SECRET!);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};
