import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

import {
    createMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie
} from "../services/movieService.js";

// Create Movie
export const createMovieController = asyncErrorHandler(async (req, res) => {
    const movie = await createMovie(req.body);

    res.status(201).json({
        status: "success",
        data: movie,
    });
});

// Get All
export const getMoviesController = asyncErrorHandler(async (req, res) => {
    const result = await getAllMovies(req.query);

    res.status(200).json({
        status: "success",
        ...result,
    });
});

// Get One
export const getMovieController = asyncErrorHandler(async (req, res) => {
    const movie = await getMovieById(req.params.id);

    res.status(200).json({
        status: "success",
        data: movie,
    });
});

// Update
export const updateMovieController = asyncErrorHandler(async (req, res) => {
    const movie = await updateMovie(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: movie,
    });
});

// Delete
export const deleteMovieController = asyncErrorHandler(async (req, res) => {
    await deleteMovie(req.params.id);

    res.status(204).send();
});
