import CustomError from "../utils/CustomError.js";
import { verifyToken } from "../utils/JWTs.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import User from "../models/User.js";

export const protect = asyncErrorHandler(async (req, res, next) => {
    // read token from cookies
    const token = req.cookies?.token;

    if (!token)
        throw new CustomError("You are not logged in, please login", 401);

    // verify token
    const decoded = await verifyToken(token);

    // find user
    const user = await User.findById(decoded.id);
    if (!user)
        throw new CustomError("The user no longer exists", 401);

    // check password changed
    if (user.passwordChangedAt) {
        const changed = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
        if (changed > decoded.iat)
            throw new CustomError(
                "You have changed your password recently, please login again",
                401
            );
    }

    // attach user
    req.user = user;
    next();
});

export const allowTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user)
            throw new CustomError("You are not logged in", 401);

        if (!roles.includes(req.user.role))
            throw new CustomError(
                "You do not have permission to perform this action",
                403
            );

        next();
    };
};
