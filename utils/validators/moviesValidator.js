import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Genre from "../../models/Genre.js";
import Actor from "../../models/Actor.js";
import Movie from "../../models/Movie.js";

export const createMovieValidator = [
    body("name")
        .notEmpty().withMessage("Movie name is required")
        .isLength({ min: 2 }).withMessage("Movie name must be at least 2 characters")
        .custom(async (name) => {
            const exists = await Movie.findOne({ name });
            if (exists) throw new CustomError("Movie already exists", 400);
            return true;
        }),

    body("description")
        .notEmpty().withMessage("Description is required"),

    body("duration")
        .optional()
        .isInt({ min: 1 }).withMessage("Duration must be a positive integer"),

    body("releaseYear")
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage("Invalid release year"),

    body("genresRefs")
        .optional()
        .isArray()
        .custom(async (ids) => {
            const promises = [];
            promises = ids.map(id => Genre.findById(id));
            const genres = await Promise.all(promises);
            const result = genres.every(genre => genre !== null);
            if (!result)
                throw new CustomError(`There is a not found genre.`, 400);
            return true;
        }),

    body("castRefs")
        .optional()
        .isArray()
        .custom(async (ids) => {
            const promises = [];
            promises = ids.map(id => Actor.findById(id));
            const actors = await Promise.all(promises);
            const result = actors.every(actor => actor !== null);
            if (!result)
                throw new CustomError(`There is a not found actor.`, 400);
            return true;
        }),

    validatorMiddleware
];

export const movieIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid movie ID"),

    validatorMiddleware
];
