const CustomError = require("./../utils/CustomError");
const JWTs = require("./../utils/JWTs");
const User = require("./../models/User");
const { asyncErrorHandler } = require("./ErrorController");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const { sendRestPasswordEmail } = require("./../utils/emails");

let sendRes = function (id, res, statusCode) {
    let token = JWTs.createToken(id);

    res.cookie("token", token, {
        maxAge: process.env.JWT_EXPIRES_IN,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false
    });

    res.status(statusCode).json({
        status: "success",
        token
    });
}

let signup = asyncErrorHandler(async function (req, res) {
    if (req.body.role && req.body.role == "admin")
        throw new CustomError("You can not sign up as an admin!", 403);

    let newUser = await User.create(req.body);

    sendRes(newUser._id, res, 201);
});

let login = asyncErrorHandler(async function (req, res) {
    let { email, password } = req.body;

    if (!email || !password)
        throw new CustomError("Please enter email & password to login!", 400);

    let user = await User.findOne({ email }).select("+password");

    if (!user || !bcryptjs.compareSync(password, user.password))
        throw new CustomError("Email or password is wrong", 400);

    sendRes(user._id, res, 200);

});

let forgetPassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
        throw new CustomError("There is no user found the provided email!", 404);

    let resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetTokenExpired = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    let resetLink = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;
    let emailText = `We receive your request to reset your password, use this link to reset password\n\n${resetLink}\n\nThis link is valid for 10 minutes`;

    try {
        await sendRestPasswordEmail({
            from: "Films Support",
            to: user.email,
            subject: "Reset Email",
            message: emailText
        });

        res.status(200).json({
            status: "success",
            message: "Reset password link sent to your email"
        });
    } catch (error) {
        user.resetToken = undefined;
        user.resetTokenExpired = undefined;
        await user.save({ validateBeforeSave: false });
        throw new CustomError("Failed to send the reset email, try again later!", 500);
    }
});

let resetPassword = asyncErrorHandler(async function (req, res) {
    let hashedResetToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    let user = await User.findOne({
        resetToken: hashedResetToken,
        resetTokenExpired: {
            $gte: Date.now()
        }
    });
    if (!user)
        throw new CustomError("Invalid or Expired reset token!", 400);

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetToken = undefined;
    user.resetTokenExpired = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    sendRes(user._id, res, 200);
});

module.exports = {
    signup,
    login,
    forgetPassword,
    resetPassword
}