import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

router.post("/get", verifyUser, getDashboard);

export default router;
