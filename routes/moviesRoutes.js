import express from "express";
import { protect, allowTo } from "../middlewares/authMiddleware.js";
import {
    getMoviesController,
    getMovieController,
    createMovieController,
    updateMovieController,
    deleteMovieController,
} from "../controllers/moviesController.js";

import {
    createMovieValidator,
    updateMovieValidator,
    movieIdValidator,
} from "../utils/validators/moviesValidator.js";
import { optionalProtect } from "../middlewares/optionalProtect .js";

const router = express.Router();


router
    .route("/")
    .get(optionalProtect, getMoviesController)
    .post(
        protect,
        allowTo("admin"),
        createMovieValidator,
        createMovieController
    );

router
    .route("/:id")
    .get(optionalProtect, movieIdValidator, getMovieController)
    .patch(
        protect,
        allowTo("admin"),
        movieIdValidator,
        updateMovieValidator,
        updateMovieController
    )
    .delete(
        protect,
        allowTo("admin"),
        movieIdValidator,
        deleteMovieController
    );

export default router;
