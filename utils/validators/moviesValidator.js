import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Genre from "../../models/Genre.js";
import Actor from "../../models/Actor.js";
import Movie from "../../models/Movie.js";

/* ================= CREATE ================= */
export const createMovieValidator = [
    body("name")
        .notEmpty()
        .withMessage("Movie name is required")
        .isLength({ min: 2 })
        .withMessage("Movie name must be at least 2 characters")
        .custom(async (name) => {
            const exists = await Movie.findOne({ name, isDeleted: false });
            if (exists) throw new CustomError("Movie already exists", 400);
            return true;
        }),

    body("description")
        .notEmpty()
        .withMessage("Description is required"),

    body("videoUrl")
        .notEmpty()
        .withMessage("Video URL is required")
        .isURL()
        .withMessage("Invalid video URL"),

    body("duration")
        .optional()
        .isInt({ min: 1 }),

    body("releaseYear")
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() }),

    body("genresRefs")
        .optional()
        .isArray()
        .custom(async (ids) => {
            const genres = await Promise.all(ids.map((id) => Genre.findById(id)));
            if (!genres.every(Boolean))
                throw new CustomError("One or more genres not found", 400);
            return true;
        }),

    body("castRefs")
        .optional()
        .isArray()
        .custom(async (ids) => {
            const actors = await Promise.all(ids.map((id) => Actor.findById(id)));
            if (!actors.every(Boolean))
                throw new CustomError("One or more actors not found", 400);
            return true;
        }),

    validatorMiddleware,
];

/* ================= PARAM ================= */
export const movieIdValidator = [
    param("id").isMongoId().withMessage("Invalid movie ID"),
    validatorMiddleware,
];

/* ================= UPDATE ================= */
export const updateMovieValidator = [
    body("name")
        .optional()
        .isLength({ min: 2 })
        .custom(async (name, { req }) => {
            const exists = await Movie.findOne({
                name,
                _id: { $ne: req.params.id },
                isDeleted: false,
            });
            if (exists) throw new CustomError("Movie already exists", 400);
            return true;
        }),

    body("videoUrl")
        .optional()
        .isURL()
        .withMessage("Invalid video URL"),

    body("duration")
        .optional()
        .isInt({ min: 1 }),

    body("releaseYear")
        .optional()
        .isInt({ min: 1900, max: new Date().getFullYear() }),

    body("genresRefs")
        .optional()
        .isArray()
        .custom(async (ids) => {
            const genres = await Promise.all(ids.map((id) => Genre.findById(id)));
            if (!genres.every(Boolean))
                throw new CustomError("One or more genres not found", 400);
            return true;
        }),

    body("castRefs")
        .optional()
        .isArray()
        .custom(async (ids) => {
            const actors = await Promise.all(ids.map((id) => Actor.findById(id)));
            if (!actors.every(Boolean))
                throw new CustomError("One or more actors not found", 400);
            return true;
        }),

    validatorMiddleware,
];
