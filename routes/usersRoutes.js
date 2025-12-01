import express from "express";
import { protect, allowTo } from "../middlewares/authMiddleware.js";
import {
    getUsersController,
    getUserController,
    updateUserController,
    deleteUserController,
} from "../controllers/userController.js";

const router = express.Router();

router.use(protect, allowTo("admin"));

router.route("/")
    .get(getUsersController);

router.route("/:id")
    .get(getUserController)
    .patch(updateUserController)
    .delete(deleteUserController);

export default router;
