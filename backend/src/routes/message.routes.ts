import { Router } from "express";
import { listMessages } from "../controllers/message.controller.js";
const r = Router();
r.get("/:id", listMessages); // history for a post
export default r;
