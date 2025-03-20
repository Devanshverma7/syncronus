import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import contactsRoutes from "./routes/ContactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

// cors
app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);

// Server
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// MongoDB connection
mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("DB connection successful.");
  })
  .catch((err) => {
    console.log(err.message);
  });
