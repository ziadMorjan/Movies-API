import rateLimit from "express-rate-limit";
import CustomError from "../utils/CustomError.js";

// 🔐 Limiter خاص بمسار forgot-password
export const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقيقة
    max: 5, // أقصى 5 محاولات خلال 15 دقيقة من نفس الـ IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next /* , options */) => {
        // نستخدم CustomError عشان يمر على الـ global error handler
        next(
            new CustomError(
                "Too many password reset requests from this IP, please try again later.",
                429
            )
        );
    },
});

export const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 دقائق
    max: 10, // 10 محاولات فقط لكل IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
        next(
            new CustomError(
                "Too many login attempts. Please wait before trying again.",
                429
            )
        );
    },
});