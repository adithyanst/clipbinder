import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

console.log(JWT_SECRET);

const prisma = new PrismaClient();

function readAuth(req, res, next) {
  const role = req.headers.authorization.role;
}

router.post("/signup", async (req, res) => {
  const body = req.body;

  const hash = await bcrypt.hash(body.password, 10);

  const user = await prisma.users.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: hash,
    },
  });

  // const result = await bcrypt.compare(body.password, hash);

  console.log(user);

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  console.log(token);

  // jwt.verify(token, JWT_SECRET, (err, user) => {
  //   console.log(user);
  // });

  res.json({ jwt: token });
});

router.post("/login", async (req, res) => {
  const body = req.body;

  const user = await prisma.users.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ jwt: token });
});

export default router;
