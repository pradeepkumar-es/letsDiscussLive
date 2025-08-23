// import { NextFunction, Request, Response } from "express";
// import { verifyJwt } from "../utils/jwt.js";

// export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.cookies[process.env.COOKIE_NAME as string];
//     if (!token) return res.status(401).json({ error: "Unauthorized" });
//     const payload = verifyJwt<{ id: string; username: string }>(token, process.env.JWT_SECRET!);
//     req.user = payload;
//     next();
//   } catch {
//     res.status(401).json({ error: "Unauthorized" });
//   }
// };
// backend/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include `user`
export interface AuthRequest extends Request {
  user?: any; // we can replace `any` with your user type if available
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};
