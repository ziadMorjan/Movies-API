import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Series from "../../models/Series.js";
import Genre from "../../models/Genre.js";
import Actor from "../../models/Actor.js";

/* ================= CREATE ================= */
export const createSeriesValidator = [
    body("name")
        .notEmpty().withMessage("Series name is required")
        .isLength({ min: 2 }).withMessage("Series name must be at least 2 characters")
        .custom(async (name) => {
            const exists = await Series.findOne({ name });
            if (exists) throw new CustomError("Series already exists", 400);
            return true;
        }),

    body("description")
        .optional()
        .isString(),

    body("genres")
        .optional()
        .isArray()
        .withMessage("Genres must be an array")
        .custom(async (ids) => {
            const genres = await Promise.all(ids.map((id) => Genre.findById(id)));
            if (genres.some((g) => !g))
                throw new CustomError("One or more genres not found", 400);
            return true;
        }),

    body("cast")
        .optional()
        .isArray()
        .withMessage("Cast must be an array")
        .custom(async (ids) => {
            const actors = await Promise.all(ids.map((id) => Actor.findById(id)));
            if (actors.some((a) => !a))
                throw new CustomError("One or more actors not found", 400);
            return true;
        }),

    validatorMiddleware,
];

/* ================= UPDATE ================= */
export const updateSeriesValidator = [
    body("name")
        .optional()
        .isLength({ min: 2 }),

    body("genres")
        .optional()
        .isArray()
        .custom(async (ids) => {
            const genres = await Promise.all(ids.map((id) => Genre.findById(id)));
            if (genres.some((g) => !g))
                throw new CustomError("One or more genres not found", 400);
            return true;
        }),

    body("cast")
        .optional()
        .isArray()
        .custom(async (ids) => {
            const actors = await Promise.all(ids.map((id) => Actor.findById(id)));
            if (actors.some((a) => !a))
                throw new CustomError("One or more actors not found", 400);
            return true;
        }),

    validatorMiddleware,
];

/* ================= ID ================= */
export const seriesIdValidator = [
    param("id")
        .isMongoId()
        .withMessage("Invalid series ID"),

    validatorMiddleware,
];
