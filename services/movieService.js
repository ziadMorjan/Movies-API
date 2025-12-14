import Movie from "../models/Movie.js";
import ApiFeatures from "../utils/apiFeatures.js";
import CustomError from "../utils/CustomError.js";

export const createMovie = async (data) => {
    const movie = await Movie.create(data);
    return movie;
};

export const getAllMovies = async (queryString) => {
    const totalDocs = await Movie.countDocuments();

    const apiFeatures = new ApiFeatures(Movie.find(), queryString)
        .filter()
        .search(["title", "description"])
        .sort()
        .limitFields()
        .paginate(totalDocs);

    const movies = await apiFeatures.query;

    return {
        results: movies.length,
        pagination: apiFeatures.pagination,
        data: movies,
    };
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
