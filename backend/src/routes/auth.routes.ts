import { Router } from "express";
import { login, logout, me, signup } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
const r = Router();
r.post("/signup", signup);
r.post("/login", login);
r.post("/logout", logout);
r.get("/me", requireAuth, me);
export default r;
