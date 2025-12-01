import express from "express";
import {
    createSeasonController,
    getSeasonsController,
    getSeasonController,
    updateSeasonController,
    deleteSeasonController,
} from "../controllers/seasonController.js";

import {
    createSeasonValidator,
    seasonIdValidator,
} from "../utils/validators/seasonValidator.js";

const router = express.Router();

router
    .route("/")
    .post(createSeasonValidator, createSeasonController)
    .get(getSeasonsController);

router
    .route("/:id")
    .get(seasonIdValidator, getSeasonController)
    .patch(seasonIdValidator, updateSeasonController)
    .delete(seasonIdValidator, deleteSeasonController);

export default router;
