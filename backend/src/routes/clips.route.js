import { Router } from "express";
import { addClip } from "../controllers/clips.controller";
import { verifyUser } from "../middleware/auth.middleware";

const router = Router();

router.post("/add", verifyUser, addClip);

export default router;
