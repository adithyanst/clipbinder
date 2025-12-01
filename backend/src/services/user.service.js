import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
  const hash = await bcrypt.hash(password, 10);

  const user = createUser({ name: name, email: email, passwordHash: hash });

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  console.log(token);

  return { jwt: token };
}

export async function loginService({ email, password }) {
  console.log(email, password);

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("invalid credentials");
    error.status = 401;
    throw error;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const error = new Error("invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return { jwt: token };
}
