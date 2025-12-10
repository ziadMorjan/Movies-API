import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
    forgotPasswordLimiter,
    loginLimiter,
} from "../middlewares/rateLimitMiddleware.js";

import {
    signupValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator,
} from "../utils/validators/authValidator.js";

import {
    getLoggedInUser,
    signupController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
    logoutController,
} from "../controllers/authController.js";

import { googleLoginController, facebookLoginController } from "../controllers/authController.js";



const router = express.Router();

router.get("/me", protect, getLoggedInUser);
router.post("/signup", signupValidator, signupController);
router.post("/login", loginLimiter, loginValidator, loginController);
router.post("/forget-password", forgotPasswordLimiter, forgotPasswordValidator, forgotPasswordController);
router.post("/reset-password/:resetToken", resetPasswordValidator, resetPasswordController);
router.get("/logout", protect, logoutController);
router.post("/google-login", googleLoginController);
router.post("/facebook-login", facebookLoginController);

export default router;
