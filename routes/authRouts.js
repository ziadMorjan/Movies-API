import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { signupValidator, loginValidator } from "../utils/validators/userValidator.js";
import { forgotPasswordLimiter, loginLimiter } from "../middlewares/rateLimitMiddleware.js";
import { signupController, loginController, forgotPasswordController, resetPasswordController, logoutController } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupValidator, signupController);
router.post("/login", loginLimiter, loginValidator, loginController);
router.post("/forgot-password", forgotPasswordLimiter, forgotPasswordController);
router.post("/reset-password/:resetToken", forgotPasswordLimiter, resetPasswordController);
router.get("/logout", protect, logoutController);

export default router;
