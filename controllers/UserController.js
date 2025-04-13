const CustomError = require("../utils/CustomError");
const QueryManipulater = require("../utils/QueryManipulater");
const User = require("./../models/User");
const { asyncErrorHandler } = require("./ErrorController");
const bcryptjs = require("bcryptjs");
let JWTs = require("./../utils/JWTs");

let getAllUsers = asyncErrorHandler(async function (req, res) {
    let qm = new QueryManipulater(User, req)
        .filter()
        .limitFields()
        .sort()
        .paginate();

    let users = await qm.query;

    res.status(200).json({
        status: "success",
        length: users.length,
        data: {
            users
        }
    });
});

let createUser = asyncErrorHandler(async function (req, res) {
    let newUser = await User.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            newUser
        }
    });
});

let getUser = asyncErrorHandler(async function (req, res) {
    let user = await User.findById(req.params.id);

    if (!user)
        throw new CustomError(`There is no user with id: ${req.params.id}`, 404);

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    });
});

let updateUser = asyncErrorHandler(async function (req, res) {
    let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedUser)
        throw new CustomError(`There is no user with id: ${req.params.id}`, 404);

    res.status(200).json({
        status: "success",
        data: {
            updatedUser
        }
    });
});

let deleteUser = asyncErrorHandler(async function (req, res) {
    let deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser)
        throw new CustomError(`There is no user with id: ${req.params.id}`, 404);

    res.status(204).json({
        status: "success",
        data: {
            deletedUser
        }
    });
});

let changePassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findById(req.user.id).select("+password");
    if (!bcryptjs.compareSync(req.body.oldPassword, user.password))
        throw new CustomError("The old password you provided is wrong!", 400);

    user.password = req.body.newPassword;
    user.confirmPassword = req.body.newConfirmPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    let token = JWTs.createToken(user.id);

    res.status(200).json({
        status: "success",
        token
    });

});

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    changePassword
}