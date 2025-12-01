import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Series from "../../models/Series.js";

export const createSeasonValidator = [
    body("series")
        .notEmpty().withMessage("Series ID is required")
        .isMongoId()
        .custom(async (id) => {
            if (!(await Series.findById(id)))
                throw new CustomError("Series not found", 400);

            return true;
        }),

    body("seasonNumber")
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage("Season number must be >= 1"),

    validatorMiddleware
];

export const seasonIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid season ID"),

    validatorMiddleware
];
