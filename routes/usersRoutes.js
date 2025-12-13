import express from "express";
import { protect, allowTo } from "../middlewares/authMiddleware.js";
import {
    getUsersController,
    createUserController,
    getUserController,
    updateUserController,
    deleteUserController,
    updateMeController,
    changePasswordController,
} from "../controllers/userController.js";

import {
    createUserValidator,
    userIdValidator,
    updateMeValidator,
    changePasswordValidator,
} from "../utils/validators/userValidator.js";

import validatorMiddleware from "../middlewares/validatorMiddleware.js";
import ensureLocalAuth from "../middlewares/ensureLocalAuth.js";

const router = express.Router();

router.use(protect);

router.patch("/update-me", updateMeValidator, validatorMiddleware, updateMeController);
router.patch("/change-password", ensureLocalAuth, changePasswordValidator, validatorMiddleware, changePasswordController);

router.use(allowTo("admin"));

router.route("/")
    .get(getUsersController)
    .post(createUserValidator, validatorMiddleware, createUserController);

router.route("/:id")
    .all(userIdValidator, validatorMiddleware)
    .get(getUserController)
    .patch(updateUserController)
    .delete(deleteUserController);

export default router;
