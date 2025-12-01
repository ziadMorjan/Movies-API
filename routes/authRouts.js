import express from "express";
import { signupController, loginController } from "../controllers/authController.js";
import { signupValidator, loginValidator } from "../utils/validators/userValidator.js";

const router = express.Router();

router.post("/signup", signupValidator, signupController);
router.post("/login", loginValidator, loginController);

export default router;
