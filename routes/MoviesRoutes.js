const express = require("express");
const MoviesController = require("./../controllers/MoviesController");
const { protect, allowTo } = require("../middlewares/AuthMiddleware");

let router = express.Router();

router.route("/moviesByGenres/:genre")
    .get(MoviesController.getMoviesByGenres);

router.route("/stats")
    .get(MoviesController.getMoviesStats);


router.route("/")
    .get(MoviesController.getAllMovies)
    .post(protect, allowTo("admin"), MoviesController.createMovie);

router.route("/:id").
    get(MoviesController.getSingleMovie)
    .patch(protect, allowTo("admin"), MoviesController.updateMovie)
    .delete(protect, allowTo("admin"), MoviesController.deleteMovie);

module.exports = router;
