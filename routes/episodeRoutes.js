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
    .post(createEpisodeValidator, createEpisodeController)
    .get(getEpisodesController);

router
    .route("/:id")
    .get(episodeIdValidator, getEpisodeController)
    .patch(episodeIdValidator, updateEpisodeController)
    .delete(episodeIdValidator, deleteEpisodeController);

export default router;
