import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

console.log(JWT_SECRET);

const prisma = new PrismaClient();

router.get("/signup", async (req, res) => {
  const body = req.body;

  const user = await prisma.users.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: body.password,
    },
  });

  console.log(user);

  const token = jwt.sign({ userId: 123, email: "test@gmail.com" }, JWT_SECRET, { expiresIn: "7d" });
  console.log(token);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    console.log(user);
  });

  res.end();
});

export default router;
