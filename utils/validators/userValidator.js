import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../../utils/CustomError.js";
import User from "../../models/User.js";

export const createUserValidator = [
    body("firstName")
        .notEmpty().withMessage("First name is required"),

    body("lastName")
        .notEmpty().withMessage("Last name is required"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .custom(async (email) => {
            const exists = await User.findOne({ email });
            if (exists) throw new CustomError("Email already exists", 400);
            return true;
        }),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }),

    body("confirmPassword")
        .notEmpty()
        .custom((val, { req }) => {
            if (val !== req.body.password)
                throw new CustomError("Passwords do not match", 400);
            return true;
        }),

    validatorMiddleware
];

export const userIdValidator = [
    param("id")
        .isMongoId().withMessage("Invalid user ID"),

    validatorMiddleware
];
