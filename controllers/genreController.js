import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

import {
    createGenre,
    getAllGenres,
    getGenreById,
    updateGenre,
    deleteGenre,
} from "../services/genreService.js";

export const createGenreController = asyncErrorHandler(async (req, res) => {
    const genre = await createGenre(req.body);

    res.status(201).json({
        status: "success",
        data: genre,
    });
});

export const getGenresController = asyncErrorHandler(async (req, res) => {
    const genres = await getAllGenres();

    res.status(200).json({
        status: "success",
        results: genres.length,
        data: genres,
    });
});

export const getGenreController = asyncErrorHandler(async (req, res) => {
    const genre = await getGenreById(req.params.id);

    res.status(200).json({
        status: "success",
        data: genre,
    });
});

export const updateGenreController = asyncErrorHandler(async (req, res) => {
    const genre = await updateGenre(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: genre,
    });
});

export const deleteGenreController = asyncErrorHandler(async (req, res) => {
    await deleteGenre(req.params.id);

    res.status(204).send();
});
