const CustomError = require("./../utils/CustomError");
const JWTs = require("./../utils/JWTs");
const User = require("./../models/User");
const { asyncErrorHandler } = require("./ErrorController");
const bcryptjs = require("bcryptjs");

let signup = asyncErrorHandler(async function (req, res) {
    let newUser = await User.create(req.body);

    let token = JWTs.createToken(newUser.id);

    res.status(201).json({
        status: "success",
        token,
        data: {
            newUser
        }
    });
});

let login = asyncErrorHandler(async function (req, res) {
    let { email, password } = req.body;

    if (!email || !password)
        throw new CustomError("Please enter email & password to login!", 400);

    let user = await User.findOne({ email }).select("+password");

    if (!user || !bcryptjs.compareSync(password, user.password))
        throw new CustomError("Email or password is wrong", 400);

    let token = JWTs.createToken(user.id);

    res.status(200).json({
        status: "success",
        token
    });

});

module.exports = {
    signup,
    login
}