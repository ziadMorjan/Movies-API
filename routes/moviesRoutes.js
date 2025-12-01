import express from "express";

import {
    createMovieController,
    getMoviesController,
    getMovieController,
    updateMovieController,
    deleteMovieController
} from "../controllers/moviesController.js";

import {
    createMovieValidator,
    movieIdValidator
} from "../utils/validators/moviesValidator.js";

import { allowTo, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(getMoviesController)
    .post(protect, allowTo("admin"), createMovieValidator, createMovieController);

router
    .route("/:id")
    .get(movieIdValidator, getMovieController)
    .patch(protect, allowTo("admin"), movieIdValidator, updateMovieController)
    .delete(protect, allowTo("admin"), movieIdValidator, deleteMovieController);

export default router;
