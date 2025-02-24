const Movie = require("./../models/Movie");
const QueryManipulater = require("./../utils/QueryManipulater");

async function getAllMovies(req, res) {
    try {
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
    }
    catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function createMovie(req, res) {
    try {
        let movie = await Movie.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                movie
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function getSingleMovie(req, res) {
    try {
        let movie = await Movie.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function updateMovie(req, res) {
    try {
        let movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function deleteMovie(req, res) {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function getMoviesStats(req, res) {
    try {
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
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function getMoviesByGenres(req, res) {
    try {
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
        })
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

module.exports = {
    getAllMovies,
    getSingleMovie,
    createMovie,
    updateMovie,
    deleteMovie,
    getMoviesStats,
    getMoviesByGenres
};