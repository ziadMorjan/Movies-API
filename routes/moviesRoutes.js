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

const router = express.Router();

router
    .route("/")
    .post(createMovieValidator, createMovieController)
    .get(getMoviesController);

router
    .route("/:id")
    .get(movieIdValidator, getMovieController)
    .patch(movieIdValidator, updateMovieController)
    .delete(movieIdValidator, deleteMovieController);

export default router;
