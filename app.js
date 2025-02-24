const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const MoviesRoutes = require("./routes/MoviesRoutes");
const DefaultRoute = require("./routes/DefaultRout");
const ErrorController = require("./controllers/ErrorController")

let app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// routes
app.use("/api/v1/movies", MoviesRoutes.router);
app.use(DefaultRoute);

app.use(ErrorController.globalErrorHandler);

module.exports = app;