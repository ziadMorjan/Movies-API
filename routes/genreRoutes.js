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
import { allowTo, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .get(getGenresController)
    .post(protect, allowTo("admin"), createGenreValidator, createGenreController);

router
    .route("/:id")
    .get(genreIdValidator, getGenreController)
    .patch(protect, allowTo("admin"), genreIdValidator, updateGenreController)
    .delete(protect, allowTo("admin"), genreIdValidator, deleteGenreController);

export default router;
