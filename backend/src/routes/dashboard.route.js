import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { getDashboard, search } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/get", verifyUser, getDashboard);
router.get("/search", verifyUser, search);

export default router;
