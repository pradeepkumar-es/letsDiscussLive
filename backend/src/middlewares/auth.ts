import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request to include `user`
export interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Access Denied" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; username: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid Token" });
  }
};
