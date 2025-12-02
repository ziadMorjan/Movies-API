import jwt from "jsonwebtoken";
import util from "util";

export function createToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.LOGIN_EXPIRE,
    });
}

export function verifyToken(token) {
    return util.promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
}

