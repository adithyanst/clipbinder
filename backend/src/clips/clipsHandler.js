import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { verifyUser } from "../auth/utils.js";

import { PrismaClient } from "@prisma/client";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

console.log(JWT_SECRET);

const prisma = new PrismaClient();

router.post("/add", async (req, res) => {
  const body = req.body;

  console.log("damn");

  const user = verifyUser(req);

  const clipPost = await prisma.clips.create({
    data: {
      data: body.data,
      type: body.type,
      usersId: user.decoded.userId,
    },
  });

  res.json(clipPost);
});

export default router;
