const express = require("express");
const MoviesController = require("./../controllers/MoviesController");

let router = express.Router();

router.route("/")
    .get(MoviesController.getAllMovies)
    .post(MoviesController.createMovie);
router.route("/:id").
    get(MoviesController.getSingleMovie)
    .patch(MoviesController.updateMovie)
    .delete(MoviesController.deleteMovie);

module.exports = {
    router
};
