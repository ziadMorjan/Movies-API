import { verifyToken } from "../utils/JWTs.js";
import User from "../models/User.js";

export const optionalProtect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) return next();

        const decoded = await verifyToken(token);

        const user = await User.findById(decoded.id);

        if (user.passwordChangedAt) {
            const changed = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
            if (changed > decoded.iat)
                throw new CustomError(
                    "You have changed your password recently, please login again",
                    401
                );
        }

        if (user) req.user = user;
    } catch (err) {
        // ignore errors
    }

    next();
};
