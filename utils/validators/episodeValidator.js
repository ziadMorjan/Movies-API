import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Series from "../../models/Series.js";
import Season from "../../models/Season.js";

export const createEpisodeValidator = [
    body("series")
        .notEmpty().isMongoId()
        .custom(async (id) => {
            if (!(await Series.findById(id)))
                throw new CustomError("Series not found", 400);
            return true;
        }),

    body("season")
        .notEmpty().isMongoId()
        .custom(async (id) => {
            if (!(await Season.findById(id)))
                throw new CustomError("Season not found", 400);
            return true;
        }),

    body("episodeNumber")
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage("Episode number must be >= 1"),

    validatorMiddleware
];

export const episodeIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid episode ID"),

    validatorMiddleware
];
