import {
  getUserInfo,
  login,
  signup,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout,
} from "../controllers/AuthController.js";
import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";

// In Express.js, Router() is a function that creates a new instance of an isolated mini-application (sub-router) that can handle routes and middleware separately from the main app instance. It allows you to organize and modularize your routes more effectively.
const authRoutes = Router();
const uploads = multer({ dest: "uploads/profiles/" });

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);
authRoutes.post("/update-profile", verifyToken, updateProfile);
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  uploads.single("profile-image"),
  addProfileImage
);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout", logout);

export default authRoutes;
