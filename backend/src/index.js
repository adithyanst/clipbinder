import express from "express";
import authHandler from "./auth/authHandler.js";
import clipsHandler from "./clips/clipsHandler.js";
import dotenv from "dotenv";

import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.use("/api/auth", authHandler);
app.use("/api/clips", clipsHandler);

app.listen(3000, () => {
  console.log("server started on 3000");
});
