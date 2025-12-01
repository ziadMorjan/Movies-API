import CustomError from "../utils/CustomError.js";
import { verifyToken } from "../utils/JWTs.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import User from "../models/User.js";

let protect = asyncErrorHandler(async function (req, res, next) {
    // check if token send with req headers
    const token = req.cookies?.token;

    if (!token)
        throw new CustomError("You are not logged in, please login", 401);

    // check if token is valid
    let decodedToken = await verifyToken(token);

    // check if the user exist
    let user = await User.findById(decodedToken.id);
    if (!user)
        throw new CustomError("There is no users with the given token is not exist", 401);

    // check if user changed his password after token is created
    if (user.passwordChangedAt) {
        let passwordChangedAtInSecondes = parseInt(Date.parse(user.passwordChangedAt) / 1000, 10);
        if (passwordChangedAtInSecondes > decodedToken.iat)
            throw new Error("You have changed your password recently, please login again", 401);
    }

    // allow the user to access the route
    req.user = user;
    next();
});

let allowTo = function (...roles) {
    return function (req, res, next) {
        if (!req.user) {
            throw new CustomError("You are not logged in", 401);
        }
        if (!roles.includes(req.user.role))
            throw new CustomError("You do not have the permeation to preform this action", 403);
        next();
    }
}

export {
    protect,
    allowTo
};
