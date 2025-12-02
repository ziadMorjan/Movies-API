import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import CustomError from "../CustomError.js";
import User from "../../models/User.js";

export const signupValidator = [
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

export const loginValidator = [
    body("email")
        .notEmpty().isEmail(),

    body("password")
        .notEmpty(),

    validatorMiddleware
];

export const forgotPasswordValidator = [
    body("email")
        .notEmpty()
        .isEmail()
        .custom(async (email) => {
            const exists = await User.findOne({ email });
            if (!exists) throw new CustomError("No user found with that email", 404);
            return true;
        }),

    validatorMiddleware
];


export const resetPasswordValidator = [
    param("resetToken")
        .notEmpty().withMessage("Reset token is required"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }),

    body("confirmPassword")
        .notEmpty().withMessage("Confirm Password required")
        .custom((val, { req }) => {
            if (val !== req.body.password)
                throw new CustomError("Passwords do not match", 400);
            return true;
        }),

    validatorMiddleware
];