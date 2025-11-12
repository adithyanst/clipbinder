import express from "express";

const router = express.Router();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

router.get("/signup", (req, res) => {
  console.log("o");
  res.end();
});

export default router;
