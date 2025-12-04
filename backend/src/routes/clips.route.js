import { Router } from "express";
import { addClip, uploadImage } from "../controllers/clips.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add", verifyUser, addClip);

router.get("/uploadImage", verifyUser, uploadImage);

export default router;
