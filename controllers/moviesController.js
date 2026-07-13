import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import {
    getMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
} from "../services/movieService.js";

export const getMoviesController = asyncErrorHandler(async (req, res) => {
    const result = await getMovies(req.query);

    // 🔐 hide videoUrl for guests
    if (!req.user) {
        result.data = result.data.map(movie => {
            movie = movie.toObject();
            delete movie.videoUrl;
            return movie;
        });
    }

    res.status(200).json({
        status: "success",
        ...result,
    });
});

export const getMovieController = asyncErrorHandler(async (req, res) => {
    const movie = await getMovieById(req.params.id);

    if (!req.user) {
        const obj = movie.toObject();
        delete obj.videoUrl;

        return res.status(200).json({
            status: "success",
            data: obj,
        });
    }

    res.status(200).json({
        status: "success",
        data: movie,
    });
});


import Notification from "../models/Notification.js";

/* ================= CREATE ================= */
export const createMovieController = asyncErrorHandler(async (req, res) => {
    if (req.files?.poster)
        req.body.poster = req.files.poster[0].path;

    if (req.files?.backdrop)
        req.body.backdrop = req.files.backdrop[0].path;

    if (req.file)
        req.body.videoUrl = req.file.path;

    const movie = await createMovie(req.body);

    // Trigger Notification for all users
    await Notification.create({
        title: "New Movie Released",
        message: `Watch the newly added movie: ${movie.name}`,
        type: "movie",
        refId: movie._id,
    });

    res.status(201).json({
        status: "success",
        data: movie,
    });
});

/* ================= UPDATE ================= */
export const updateMovieController = asyncErrorHandler(async (req, res) => {
    const movie = await updateMovie(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: movie,
    });
});

/* ================= DELETE ================= */
export const deleteMovieController = asyncErrorHandler(async (req, res) => {
    await deleteMovie(req.params.id);
    await Notification.deleteMany({ refId: req.params.id });
    res.status(204).send();
});
