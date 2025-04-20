const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const MoviesRoutes = require("./routes/MoviesRoutes");
const UsersRoutes = require("./routes/UsersRoutes");
const AuthRouts = require("./routes/AuthRouts");
const DefaultRoute = require("./routes/DefaultRout");
const { globalErrorHandler } = require("./controllers/ErrorController");

let app = express();

let limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 100000,
    message: "You reach the limit for requests, please try again in an hour"
});

// middlewares
app.use(helmet());
app.use(express.json());
app.use(sanitize());
app.use(xss());
app.use(limiter);
app.use(morgan("dev"));
app.use(cors());

// routes
app.use("/api/v1/movies", MoviesRoutes);
app.use("/api/v1/users", UsersRoutes);
app.use("/api/v1/auth", AuthRouts);
app.use(DefaultRoute);

app.use(globalErrorHandler);

module.exports = app;