import express from "express";
import { protect, allowTo } from "../middlewares/authMiddleware.js";

import {
    getSeriesController,
    createSeriesController,
    getSeriesControllerById,
    updateSeriesController,
    deleteSeriesController,
} from "../controllers/seriesController.js";

import {
    createSeriesValidator,
    updateSeriesValidator,
    seriesIdValidator,
} from "../utils/validators/seriesValidator.js";
import seasonRoutes from "./seasonRoutes.js";
import { uploadImage } from "../middlewares/uploadMiddleware.js";


const router = express.Router();

router.use("/:seriesId/seasons", seasonRoutes);

router
    .route("/")
    .get(getSeriesController)
    .post(
        protect,
        allowTo("admin"),
        uploadImage.fields([
            { name: "poster", maxCount: 1 },
            { name: "backdrop", maxCount: 1 },
        ]),
        createSeriesValidator,
        createSeriesController
    );

router
    .route("/:id")
    .get(seriesIdValidator, getSeriesControllerById)
    .patch(
        protect,
        allowTo("admin"),
        seriesIdValidator,
        updateSeriesValidator,
        updateSeriesController
    )
    .delete(
        protect,
        allowTo("admin"),
        seriesIdValidator,
        deleteSeriesController
    );

export default router;
