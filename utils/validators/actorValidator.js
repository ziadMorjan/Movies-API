import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import Actor from "../../models/Actor.js";

export const createActorValidator = [
    body("name")
        .notEmpty().withMessage("Actor name is required")
        .isLength({ min: 2 }),

    body("popularity")
        .optional()
        .isFloat({ min: 0 }),

    body("name").custom(async (name) => {
        const exists = await Actor.findOne({ name });
        if (exists) throw new CustomError("Actor already exists", 400);
        return true;
    }),

    validatorMiddleware
];

export const actorIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid actor ID"),

    validatorMiddleware
];
