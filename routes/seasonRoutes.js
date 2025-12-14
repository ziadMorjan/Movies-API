import express from "express";
import { protect, allowTo } from "../middlewares/authMiddleware.js";
import {
    getSeasonsController,
    createSeasonController,
    getSeasonController,
    updateSeasonController,
    deleteSeasonController,
} from "../controllers/seasonController.js";

import {
    seriesIdValidator,
    seasonIdValidator,
    createSeasonValidator,
    updateSeasonValidator,
} from "../utils/validators/seasonValidator.js";
import episodeRoutes from "./episodeRoutes.js";


const router = express.Router({ mergeParams: true });

router.use("/:seasonId/episodes", episodeRoutes);

router
    .route("/")
    .get(seriesIdValidator, getSeasonsController)
    .post(
        protect,
        allowTo("admin"),
        seriesIdValidator,
        createSeasonValidator,
        createSeasonController
    );

router
    .route("/:seasonId")
    .get(seriesIdValidator, seasonIdValidator, getSeasonController)
    .patch(
        protect,
        allowTo("admin"),
        seriesIdValidator,
        seasonIdValidator,
        updateSeasonValidator,
        updateSeasonController
    )
    .delete(
        protect,
        allowTo("admin"),
        seriesIdValidator,
        seasonIdValidator,
        deleteSeasonController
    );

export default router;
