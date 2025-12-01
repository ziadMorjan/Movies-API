import jwt from "jsonwebtoken";
import util from "util";

function createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.LOGIN_EXPIRE
    });
}

function verifyToken(token) {
    return util.promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
}

export {
    createToken,
    verifyToken
};
