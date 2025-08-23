import { Request, Response } from "express";
import User from "../models/User.js";
import { signJwt } from "../utils/jwt.js";
import { AuthRequest } from "../middlewares/auth.js";

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });

    const token = signJwt(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!
    );

    res.status(201).json({ id: user.id, username: user.username, token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signJwt(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET!
    );

    res.json({ id: user.id, username: user.username, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get logged-in user
export const me = (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  res.json(req.user);
};
// Logout (frontend should also remove token)
export const logout = (_req: Request, res: Response) => {
  res.json({ ok: true, message: "Logged out successfully" });
};