import express from "express";
import {
    createGenreController,
    getGenresController,
    getGenreController,
    updateGenreController,
    deleteGenreController,
} from "../controllers/genreController.js";

import {
    createGenreValidator,
    genreIdValidator,
} from "../utils/validators/genreValidator.js";

const router = express.Router();

router
    .route("/")
    .post(createGenreValidator, createGenreController)
    .get(getGenresController);

router
    .route("/:id")
    .get(genreIdValidator, getGenreController)
    .patch(genreIdValidator, updateGenreController)
    .delete(genreIdValidator, deleteGenreController);

export default router;
