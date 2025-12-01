import express from "express";
import {
    createEpisodeController,
    getEpisodesController,
    getEpisodeController,
    updateEpisodeController,
    deleteEpisodeController,
} from "../controllers/episodeController.js";

import {
    createEpisodeValidator,
    episodeIdValidator,
} from "../utils/validators/episodeValidator.js";

const router = express.Router();

router
    .route("/")
    .get(getEpisodesController)
    .post(protect, allowTo("admin"), createEpisodeValidator, createEpisodeController);

router
    .route("/:id")
    .get(episodeIdValidator, getEpisodeController)
    .patch(protect, allowTo("admin"), episodeIdValidator, updateEpisodeController)
    .delete(protect, allowTo("admin"), episodeIdValidator, deleteEpisodeController);

export default router;
