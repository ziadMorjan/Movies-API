import Notification from "../models/Notification.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

// @desc    Get all notifications sorted by newest
// @route   GET /api/v1/notifications
// @access  Protected
export const getNotificationsController = asyncErrorHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(limit);

    res.status(200).json({
        status: "success",
        results: notifications.length,
        data: notifications,
    });
});
