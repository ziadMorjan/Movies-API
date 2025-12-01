import express from "express";
import {
    getUsersController,
    getUserController,
    updateUserController,
    deleteUserController,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/")
    .get(getUsersController);

router.route("/:id")
    .get(getUserController)
    .patch(updateUserController)
    .delete(deleteUserController);

export default router;
