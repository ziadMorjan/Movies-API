const Movie = require("./../models/Movie")

async function getAllMovies(req, res) {
    res.send("getAllMovies")
}

async function createMovie(req, res) {
    res.send("createMovie")
}

function getSingleMovie(req, res) {
    res.send("getSingleMovie");
}

function updateMovie(req, res) {
    res.send("updateMovie");
}

function deleteMovie(req, res) {
    res.send("updateMovie");
}

module.exports = {
    getAllMovies,
    getSingleMovie,
    createMovie,
    updateMovie,
    deleteMovie
};