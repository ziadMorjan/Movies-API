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

const router = express.Router();

router
    .route("/")
    .post(createActorValidator, createActorController)
    .get(getActorsController);

router
    .route("/:id")
    .get(actorIdValidator, getActorController)
    .patch(actorIdValidator, updateActorController)
    .delete(actorIdValidator, deleteActorController);

export default router;

