const Movie = require("./../models/Movie")

async function getAllMovies(req, res) {
    try {
        let queryObj,
            queryStr = JSON.stringify(req.query);

        console.log(`req.query => `);
        console.log(req.query);

        // filtering logic
        if (queryStr.includes("$")) {
            queryObj = req.query;
        }
        else {
            queryStr = queryStr.replace(/(gte|gt|lte|lt)/, match => `$${match}`);
            queryObj = { ...JSON.parse(queryStr) };
            ["sort", "page", "limit"].forEach((ele) => {
                if (queryObj[ele]) {
                    delete queryObj[ele];
                }
            });
        }

        console.log(`queryObj => `);
        console.log(queryObj);
        let query = Movie.find(queryObj);

        // sort logic
        if (req.query.sort) {
            req.query.sort = req.query.sort.split(",").join(" ");
            query = query.sort(req.query.sort);
        }
        else {
            query = query.sort("createdAt");
        }

        console.log(`req.query => `);
        console.log(req.query);

        let movies = await query;
        res.status(200).json({
            status: "succsess",
            length: movies.length,
            data: {
                movies
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

module.exports = {
    getAllMovies,
    getSingleMovie,
    createMovie,
    updateMovie,
    deleteMovie
};