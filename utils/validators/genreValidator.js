import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Genre from "../../models/Genre.js";

export const createGenreValidator = [
    body("name_en")
        .notEmpty().withMessage("English name is required")
        .isLength({ min: 2 })
        .custom(async (name) => {
            const exists = await Genre.findOne({ name_en: name });
            if (exists) throw new CustomError("Genre already exists", 400);
            return true;
        }),

    body("type")
        .optional()
        .isIn(["movie", "series", "both"])
        .withMessage("Invalid genre type"),

    validatorMiddleware
];

export const genreIdValidator = [
    param("id").isMongoId().withMessage("Invalid genre ID"),
    validatorMiddleware
];
