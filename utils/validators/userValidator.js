import bcrypt from "bcryptjs";
import { body, param } from "express-validator";
import CustomError from "../../utils/CustomError.js";
import User from "../../models/User.js";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";

export const createUserValidator = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .custom(async (email) => {
            const exists = await User.findOne({ email });
            if (exists) throw new CustomError("Email already exists", 400);
            return true;
        }),

    body("password").notEmpty().withMessage("Password is required").isLength({ min: 8 }),

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

export const updateMeValidator = [
    body("firstName").optional().notEmpty(),
    body("lastName").optional().notEmpty(),

    body("email")
        .optional()
        .isEmail().withMessage("Invalid email format")
        .custom(async (email, { req }) => {
            const exists = await User.findOne({ email });
            if (exists && exists._id.toString() !== req.user._id.toString()) {
                throw new CustomError("Email already in use", 400);
            }
            return true;
        }),

    body("photo").optional().isString(),

    // Prevent dangerous updates
    body("role").not().exists().withMessage("Role cannot be updated"),
    body("password").not().exists().withMessage("Password cannot be updated here"),

    validatorMiddleware
];

export const changePasswordValidator = [
    body("currentPassword")
        .notEmpty().withMessage("Current password is required")
        .custom(async (currentPassword, { req }) => {
            if (!req.user) throw new CustomError("Not authenticated", 401);

            const user = await User.findById(req.user._id).select("+password");
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) throw new CustomError("Current password is incorrect", 400);

            return true;
        }),

    body("newPassword")
        .notEmpty().withMessage("New password is required")
        .isLength({ min: 8 }).withMessage("New password must be at least 8 characters long"),

    body("confirmNewPassword")
        .notEmpty()
        .custom((val, { req }) => {
            if (val !== req.body.newPassword) {
                throw new CustomError("New passwords do not match", 400);
            }
            return true;
        }),

    validatorMiddleware
];
