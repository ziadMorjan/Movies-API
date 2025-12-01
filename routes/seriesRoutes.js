import express from "express";
import {
    createSeriesController,
    getSeriesController,
    getSingleSeriesController,
    updateSeriesController,
    deleteSeriesController,
} from "../controllers/seriesController.js";

import {
    createSeriesValidator,
    seriesIdValidator,
} from "../utils/validators/seriesValidator.js";

const router = express.Router();

router
    .route("/")
    .post(createSeriesValidator, createSeriesController)
    .get(getSeriesController);

router
    .route("/:id")
    .get(seriesIdValidator, getSingleSeriesController)
    .patch(seriesIdValidator, updateSeriesController)
    .delete(seriesIdValidator, deleteSeriesController);

export default router;
