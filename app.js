const express = require("express");
const morgan = require("morgan");
const MoviesRoutes = require("./routes/MoviesRoutes");

let app = express();

// middlewares
app.use(express.json()); // to reach req.body
app.use(morgan("dev"));

// routes
app.use("/api/v1/movies", MoviesRoutes.router);

module.exports = app;