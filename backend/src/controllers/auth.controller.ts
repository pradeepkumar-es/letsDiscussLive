import { Request, Response } from "express";
import { StatusCodes as S } from "http-status-codes";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
// import { signJwt } from "../utils/jwt.js";
// import { CookieOptions } from "express";

// Set cookie options
const cookieOpts: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",       // true in production, false in dev
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // TS-safe union type
  // domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined, // domain only for prod
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();

  // const token = signJwt({ id: user.id, username: user.username }, process.env.JWT_SECRET!);
  // res.cookie(process.env.COOKIE_NAME!, token, cookieOpts)
  //    .status(S.CREATED)
  //    .json({ id: user.id, username: user.username, email: user.email });

  const token = generateToken(user.id, user.username, user.email);
  res.json({ token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(S.UNAUTHORIZED).json({ error: "Invalid credentials" });
  }

  // const token = signJwt({ id: user.id, username: user.username }, process.env.JWT_SECRET!);

  // res.cookie(process.env.COOKIE_NAME!, token, cookieOpts)
  //    .json({ id: user.id, username: user.username, email: user.email });

  const token = generateToken(user.id, user.username, user.email);
  res.json({ token });
};

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const logout = async (_req: Request, res: Response) => {
  // res
  //   .clearCookie(process.env.COOKIE_NAME!, {
  //     httpOnly: true,
  //     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  //     secure: process.env.NODE_ENV === "production",
  //     domain:
  //       process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
  //   })
    res.json({ ok: true, message:"Logged out Successfully" });
};
