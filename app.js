const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const MoviesRoutes = require("./routes/MoviesRoutes");
const UsersRoutes = require("./routes/UsersRoutes");
const AuthRouts = require("./routes/AuthRouts");
const DefaultRoute = require("./routes/DefaultRout");
const { globalErrorHandler } = require("./controllers/ErrorController");

let app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// routes
app.use("/api/v1/movies", MoviesRoutes);
app.use("/api/v1/users", UsersRoutes);
app.use("/api/v1/auth", AuthRouts);
app.use(DefaultRoute);

app.use(globalErrorHandler);

module.exports = app;