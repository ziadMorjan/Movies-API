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
import { allowTo, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(getSeriesController)
    .post(protect, allowTo("admin"), createSeriesValidator, createSeriesController);

router
    .route("/:id")
    .get(seriesIdValidator, getSingleSeriesController)
    .patch(protect, allowTo("admin"), seriesIdValidator, updateSeriesController)
    .delete(protect, allowTo("admin"), seriesIdValidator, deleteSeriesController);

export default router;
