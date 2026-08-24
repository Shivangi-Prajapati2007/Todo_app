import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

export default app;