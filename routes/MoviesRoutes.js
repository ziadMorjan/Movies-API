const express = require("express");
const MoviesController = require("./../controllers/MoviesController");

let router = express.Router();

router.route("/moviesByGenres/:genre")
    .get(MoviesController.getMoviesByGenres);

router.route("/stats")
    .get(MoviesController.getMoviesStats);


router.route("/")
    .get(MoviesController.getAllMovies)
    .post(MoviesController.createMovie);

router.route("/:id").
    get(MoviesController.getSingleMovie)
    .patch(MoviesController.updateMovie)
    .delete(MoviesController.deleteMovie);

module.exports = router;
