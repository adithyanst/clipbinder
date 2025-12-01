import { Router } from "express";
import { addClip } from "../controllers/clips.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add", verifyUser, addClip);

export default router;
