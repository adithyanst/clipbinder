import express from "express";
import authHandler from "./auth/authHandler.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authHandler);

app.listen(3000, () => {
  console.log("server started on 3000");
});
