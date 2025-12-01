import Movie from "../models/Movie.js";
import CustomError from "../utils/CustomError.js";

export const createMovie = async (data) => {
    const movie = await Movie.create(data);
    return movie;
};

export const getAllMovies = async () => {
    const movies = await Movie.find();
    return movies;
};

export const getMovieById = async (id) => {
    const movie = await Movie.findById(id);
    if (!movie) throw new CustomError("Movie not found", 404);
    return movie;
};

export const updateMovie = async (id, data) => {
    const movie = await Movie.findByIdAndUpdate(id, data, {
        new: true,
    });
    if (!movie) throw new CustomError("Movie not found", 404);
    return movie;
};

export const deleteMovie = async (id) => {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) throw new CustomError("Movie not found", 404);
    return movie;
};
