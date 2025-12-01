import express from "express";
import morgan from "morgan";
import cors from "cors";

import movieRoutes from "./routes/moviesRoutes.js";
import actorRoutes from "./routes/actorRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import seriesRoutes from "./routes/seriesRoutes.js";
import seasonRoutes from "./routes/seasonRoutes.js";
import episodeRoutes from "./routes/episodeRoutes.js";
import authRoutes from "./routes/authRouts.js";
import userRoutes from "./routes/usersRoutes.js";

import CustomError from "./utils/CustomError.js";
import { globalErrorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

// ----------------------
// Middlewares
// ----------------------
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ----------------------
// Test Route
// ----------------------
app.get("/", (req, res) => {
    res.json({ message: "CimaFlix API is running..." });
});

// ----------------------
// API Routes
// ----------------------
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/actors", actorRoutes);
app.use("/api/v1/genres", genreRoutes);
app.use("/api/v1/series", seriesRoutes);
app.use("/api/v1/seasons", seasonRoutes);
app.use("/api/v1/episodes", episodeRoutes);

app.use("/api/v1/auth", authRoutes);   // Signup/Login
app.use("/api/v1/users", userRoutes);  // Users CRUD

// ----------------------
// Handle Unknown Routes
// ----------------------
app.all("*", (req, res, next) => {
    next(new CustomError(`Can't find ${req.originalUrl} on this server`, 404));
});

// ----------------------
// Global Error Handler
// ----------------------
app.use(globalErrorHandler);

export default app;
