import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateUser } from "../utils/validators.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

async function createUser({ name, email, passwordHash }) {
  const user = await prisma.users.create({
    data: {
      name: name,
      email: email,
      passwordHash: passwordHash,
    },
  });

  return user;
}

export async function signUpService({ name, email, password }) {
  validateUser({ email, password, name });

  const hash = await bcrypt.hash(password, 10);

  const user = await createUser({ name: name, email: email, passwordHash: hash });

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return { jwt: token };
}

export async function loginService({ email, password }) {
  validateUser({ email, password });

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return { jwt: token };
}
