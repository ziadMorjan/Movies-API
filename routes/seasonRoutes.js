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
import { allowTo, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(getSeasonsController)
    .post(protect, allowTo("admin"), createSeasonValidator, createSeasonController);

router
    .route("/:id")
    .get(seasonIdValidator, getSeasonController)
    .patch(protect, allowTo("admin"), seasonIdValidator, updateSeasonController)
    .delete(protect, allowTo("admin"), seasonIdValidator, deleteSeasonController);

export default router;
