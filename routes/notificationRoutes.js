import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getNotificationsController } from "../controllers/notificationController.js";

const router = express.Router();

// Fetch notifications (Requires login)
router.get("/", protect, getNotificationsController);

export default router;
