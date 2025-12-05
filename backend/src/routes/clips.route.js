import { Router } from "express";
import { addClip, uploadImage, togglePin, deleteClipHandler } from "../controllers/clips.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add", verifyUser, addClip);
router.post("/togglePin", verifyUser, togglePin);
router.post("/delete", verifyUser, deleteClipHandler);

router.get("/uploadImage", verifyUser, uploadImage);

export default router;
