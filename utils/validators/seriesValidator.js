import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Genre from "../../models/Genre.js";
import Actor from "../../models/Actor.js";
import Series from "../../models/Series.js";

export const createSeriesValidator = [
    body("name")
        .notEmpty().withMessage("Series name is required")
        .isLength({ min: 2 })
        .custom(async (name) => {
            const exists = await Series.findOne({ name });
            if (exists) throw new CustomError("Series already exists", 400);
            return true;
        }),

    body("genres")
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

    body("cast")
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

export const seriesIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid series ID"),

    validatorMiddleware
];
