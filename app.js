const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const MoviesRoutes = require("./routes/MoviesRoutes");

let app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// routes
app.use("/api/v1/movies", MoviesRoutes.router);

module.exports = app;