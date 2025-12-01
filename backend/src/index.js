import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/auth.route.js";
import clipsRouter from "./routes/clips.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.use("/auth", authRouter);
app.use("/clips", clipsRouter);
app.use("/dashboard", dashboardRouter);

app.listen(3000, () => {
  console.log("server started on 3000");
});
