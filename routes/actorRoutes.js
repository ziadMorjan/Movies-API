import express from "express";
import {
    createActorController,
    getActorsController,
    getActorController,
    updateActorController,
    deleteActorController,
} from "../controllers/actorController.js";

import {
    createActorValidator,
    actorIdValidator,
} from "../utils/validators/actorValidator.js";
import { allowTo, protect } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(getActorsController)
    .post(protect, allowTo("admin"), uploadImage.single("profilePath"), createActorValidator, createActorController);

router
    .route("/:id")
    .get(actorIdValidator, getActorController)
    .patch(protect, allowTo("admin"), actorIdValidator, updateActorController)
    .delete(protect, allowTo("admin"), actorIdValidator, deleteActorController);

export default router;

