import Movie from "../models/Movie.js";
import ApiFeatures from "../utils/ApiFeatures.js";
import CustomError from "../utils/CustomError.js";

/* ================= GET ALL ================= */
// services/movieService.js
export const getMovies = async (queryString) => {
    const filter = { isDeleted: false };

    const totalDocs = await Movie.countDocuments(filter);

    const apiFeatures = new ApiFeatures(Movie.find(filter), queryString)
        .search(["name", "description"])
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
    const movie = await Movie.findOne({ _id: id, isDeleted: false });
    if (!movie) throw new CustomError("Movie not found", 404);
    return movie;
};

/* ================= CREATE ================= */
export const createMovie = async (data) => {
    return await Movie.create(data);
};

/* ================= UPDATE ================= */
export const updateMovie = async (id, data) => {
    const movie = await Movie.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!movie) throw new CustomError("Movie not found", 404);
    return movie;
};

/* ================= DELETE (SOFT) ================= */
export const deleteMovie = async (id) => {
    const movie = await Movie.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
    );

    if (!movie) throw new CustomError("Movie not found", 404);
    return movie;
};
