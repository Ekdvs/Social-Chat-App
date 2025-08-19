import { Router } from "express";
import { register, verifyEmail, login, logout, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);

export default router;
