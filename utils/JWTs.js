const jwt = require("jsonwebtoken");

function createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.LOGIN_EXPIRE
    });
}

module.exports = {
    createToken
}