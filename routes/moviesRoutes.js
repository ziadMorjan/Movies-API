import express from "express";
import { protect, allowTo } from "../middlewares/authMiddleware.js";
import {
    getMoviesController,
    getMovieController,
    createMovieController,
    updateMovieController,
    deleteMovieController,
    aiChatMoviesController,
} from "../controllers/moviesController.js";

import {
    createMovieValidator,
    updateMovieValidator,
    movieIdValidator,
} from "../utils/validators/moviesValidator.js";
import { optionalProtect } from "../middlewares/optionalProtect .js";
import { uploadImage, uploadVideo } from "../middlewares/uploadMiddleware.js";

const router = express.Router();


router
    .route("/")
    .get(optionalProtect, getMoviesController)
    .post(
        protect,
        allowTo("admin"),
        uploadImage.fields([
            { name: "poster", maxCount: 1 },
            { name: "backdrop", maxCount: 1 },
        ]),
        uploadVideo.single("video"),
        createMovieValidator,
        createMovieController
    );

// 🤖 AI Chat — must be before /:id to avoid clash
router.post("/ai-chat", optionalProtect, aiChatMoviesController);

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
