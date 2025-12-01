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
            data: { user }
        });
});

export const logoutController = asyncErrorHandler(async (req, res) => {
    res
        .cookie("token", "", { maxAge: 1 })
        .status(200)
        .json({ status: "success", message: "Logged out successfully" });
});


export const forgotPasswordController = asyncErrorHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError("No user found with that email", 404);
    }

    // 1) Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 2) Create reset link
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 3) Send email 

    try {
        await sendEmail({
            to: user.email,
            subject: "CimaFlix Password Reset",
            html: resetPasswordTemplate(resetURL)
        });

    } catch (error) {
        user.resetToken = undefined;
        user.resetTokenExpired = undefined;
        await user.save({ validateBeforeSave: false });
        throw new CustomError("There was an error sending the email. Try again later.", 500);
    }
    res.status(200).json({
        status: "success",
        message: "Password reset email sent"
    });

});

export const resetPasswordController = asyncErrorHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { password, confirmPassword } = req.body;

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // 1) Find user with matching hash and token not expired
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new CustomError("Invalid or expired reset token", 400);
    }

    // 2) Update password
    user.password = password;

    // 3) Remove reset fields
    user.resetToken = undefined;
    user.resetTokenExpired = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    // 4) Auto login → send new cookie token
    const token = createToken(user._id);

    res
        .cookie("token", token, cookieOptions)
        .status(200)
        .json({
            status: "success",
            message: "Password reset successful",
            user
        });
});
