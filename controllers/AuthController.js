const User = require("./../models/User");
const { asyncErrorHandler } = require("./ErrorController");

let signup = asyncErrorHandler(async function (req, res) {
    let newUser = await User.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            newUser
        }
    });
});

module.exports = {
    signup
}