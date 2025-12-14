import express from "express";
import { protect, allowTo } from "../middlewares/authMiddleware.js";
import {
    getEpisodesController,
    getEpisodeController,
    createEpisodeController,
    updateEpisodeController,
    deleteEpisodeController,
} from "../controllers/episodeController.js";

import {
    seriesIdValidator,
    seasonIdValidator,
    episodeIdValidator,
    createEpisodeValidator,
    updateEpisodeValidator,
} from "../utils/validators/episodeValidator.js";
import { optionalProtect } from "../middlewares/optionalProtect .js";

const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(optionalProtect, seriesIdValidator, seasonIdValidator, getEpisodesController)
    .post(
        protect,
        allowTo("admin"),
        seriesIdValidator,
        seasonIdValidator,
        createEpisodeValidator,
        createEpisodeController
    );

router
    .route("/:episodeId")
    .get(optionalProtect, episodeIdValidator, getEpisodeController)
    .patch(
        protect,
        allowTo("admin"),
        episodeIdValidator,
        updateEpisodeValidator,
        updateEpisodeController
    )
    .delete(
        protect,
        allowTo("admin"),
        episodeIdValidator,
        deleteEpisodeController
    );

export default router;
