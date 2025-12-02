import express from "express";
import { protect, allowTo } from "../middlewares/authMiddleware.js";
import {
    getUsersController,
    createUserController,
    getUserController,
    updateUserController,
    deleteUserController,
} from "../controllers/userController.js";

import {
    createUserValidator,
    userIdValidator
} from "../utils/validators/userValidator.js"
const router = express.Router();

router.use(protect, allowTo("admin"));

router.route("/")
    .get(getUsersController)
    .post(createUserValidator, createUserController);

router.use(userIdValidator);
router.route("/:id")
    .get(getUserController)
    .patch(updateUserController)
    .delete(deleteUserController);

export default router;
