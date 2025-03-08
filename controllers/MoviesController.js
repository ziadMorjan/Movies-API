const CustomError = require("../utils/CustomError");
const Movie = require("./../models/Movie");
const QueryManipulater = require("./../utils/QueryManipulater");
const { asyncErrorHandler } = require("./ErrorController");

let getAllMovies = asyncErrorHandler(async function (req, res) {
    let qm = new QueryManipulater(Movie, req)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    let movies = await qm.query;

    res.status(200).json({
        status: "success",
        length: movies.length,
        data: {
            movies
        }
    });
});

let createMovie = asyncErrorHandler(async function (req, res) {
    let newMovie = await Movie.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            newMovie
        }
    });
});

let getSingleMovie = asyncErrorHandler(async function (req, res) {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
        throw new CustomError(`There is no movie with id '${req.params.id}'`, 404);
    }

    res.status(200).json({
        status: "success",
        data: {
            movie
        }
    });
});

let updateMovie = asyncErrorHandler(async function (req, res) {
    let updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedMovie) {
        throw new CustomError(`There is no movie with id '${req.params.id}'`, 404);
    }

    res.status(200).json({
        status: "success",
        data: {
            updatedMovie
        }
    });
});

let deleteMovie = asyncErrorHandler(async function (req, res) {
    let deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
        throw new CustomError(`There is no movie with id '${req.params.id}'`, 404);
    }

    res.status(204).json({
        status: "success",
        data: null
    });
});

let getMoviesStats = asyncErrorHandler(async function (req, res) {
    let stats = await Movie.aggregate([
        // { $match: { rating: { $gte: 7 } } },
        {
            $group: {
                _id: "$releaseYear",
                avgPrice: { $avg: "$price" },
                maxPrice: { $max: "$price" },
                minPrice: { $min: "$price" },
                totalPrice: { $sum: "$price" },
                count: { $sum: 1 }
            }
        },
        { $addFields: { "releaseYear": "$_id" } },
        { $project: { "_id": 0 } },
        { $sort: { "releaseYear": 1 } }
    ]);

    res.status(200).json({
        status: "success",
        count: stats.length,
        data: {
            stats
        }
    });
});

let getMoviesByGenres = asyncErrorHandler(async function (req, res) {
    let genre = req.params.genre;
    console.log(genre);

    let movies = await Movie.aggregate([
        { $unwind: "$genres" },
        {
            $group: {
                _id: "$genres",
                count: { $sum: 1 },
                movies: { $push: "$name" }
            }
        },
        { $addFields: { "genre": "$_id" } },
        { $project: { _id: 0 } },
        { $match: { genre } }
    ]);

    res.status(200).json({
        status: "success",
        count: movies.length,
        data: {
            movies
        }
    });
});

module.exports = {
    getAllMovies,
    getSingleMovie,
    createMovie,
    updateMovie,
    deleteMovie,
    getMoviesStats,
    getMoviesByGenres
};