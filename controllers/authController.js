import crypto from "crypto";
import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import { createToken } from "../utils/JWTs.js";
import { authenticateUser } from "../services/authService.js";
import { createUser } from "../services/userService.js";
import cookieOptions from "../utils/cookieOptions.js";
import { sendEmail } from "../utils/sendEmail.js";
import { resetPasswordTemplate } from "../utils/emailTemplates/resetPasswordTemplate.js";
import { errorLogger } from "../utils/logger.js";

export const getLoggedInUser = asyncErrorHandler(async (req, res) => {
    if (!req.user) {
        throw new CustomError("User not logged in.", 401);
    }


    req.user.resetToken = undefined;
    req.user.resetTokenExpired = undefined;
    res.status(200).json({
        status: "success",
        data: { user: req.user },
    });
});

export const signupController = asyncErrorHandler(async (req, res) => {
    const user = await createUser(req.body);
    const token = createToken(user._id);

    res
        .cookie("token", token, cookieOptions)
        .status(201)
        .json({
            status: "success",
            data: { user },
        });
});

export const loginController = asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    const token = createToken(user._id);

    res
        .cookie("token", token, cookieOptions)
        .status(200)
        .json({
            status: "success",
            data: { user },
        });
});

export const logoutController = asyncErrorHandler(async (req, res) => {
    res
        .cookie("token", "", { maxAge: 1 })
        .status(200)
        .json({
            status: "success",
            message: "Logged out successfully",
        });
});

export const forgotPasswordController = asyncErrorHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
    try {
        await sendEmail({
            to: user.email,
            subject: "CimaFlix Password Reset",
            html: resetPasswordTemplate(resetURL),
        });

        res.status(200).json({
            status: "success",
            message: "Password reset email sent",
        });
    } catch (err) {
        user.resetToken = undefined;
        user.resetTokenExpired = undefined;
        await user.save({ validateBeforeSave: false });
        errorLogger(err);
        throw new CustomError(
            "Failed to send email, try again later.",
            500
        );
    }
});

export const resetPasswordController = asyncErrorHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    const user = await User.findOne({
        resetToken: hashedToken,
        resetTokenExpired: { $gt: Date.now() },
    });

    if (!user)
        throw new CustomError("Invalid or expired reset token", 400);

    user.password = password;
    user.passwordChangedAt = Date.now();

    user.resetToken = undefined;
    user.resetTokenExpired = undefined;

    await user.save();

    const token = createToken(user._id);

    res
        .cookie("token", token, cookieOptions)
        .status(200)
        .json({
            status: "success",
            message: "Password reset successful",
            user,
        });
});
