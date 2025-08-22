import { Request, Response } from "express";
import { StatusCodes as S } from "http-status-codes";
import User from "../models/User.js";
import { signJwt } from "../utils/jwt.js";

const cookieOpts = {
  httpOnly: true,
  secure: true, //set it to false for local
  sameSite: "none",
  domain: ".onrender.com", //for production
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();
  const token = signJwt({ id: user.id, username: user.username }, process.env.JWT_SECRET!);
  res.cookie(process.env.COOKIE_NAME!, token, cookieOpts).status(S.CREATED).json({
    id: user.id, username: user.username, email: user.email
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(S.UNAUTHORIZED).json({ error: "Invalid credentials" });
  const token = signJwt({ id: user.id, username: user.username }, process.env.JWT_SECRET!);
  res.cookie(process.env.COOKIE_NAME!, token, cookieOpts).json({
    id: user.id, username: user.username, email: user.email
  });
};

export const me = async (req: Request, res: Response) => res.json(req.user);

export const logout = async (_req: Request, res: Response) =>
  res.clearCookie(process.env.COOKIE_NAME!, { httpOnly: true, sameSite: "none" }).json({ ok: true });
