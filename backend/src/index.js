import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();

app.use(express.json());

const prisma = new PrismaClient()

app.get("/api/auth/signup", (req, res) => {
  console.log(yo)
  res.end()
})
