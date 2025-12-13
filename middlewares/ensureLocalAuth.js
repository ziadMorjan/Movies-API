import CustomError from "../utils/CustomError.js";
import User from "../models/User.js";
import { asyncErrorHandler } from "./errorMiddleware.js";

const ensureLocalAuth = asyncErrorHandler(async (req, res, next) => {
    const email = req.body.email;

    if (!email) {
        throw new CustomError("Email is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomError("User not found", 404);
    }

    if (user.authProvider !== "local") {
        if (req.path.includes("login"))
            throw new CustomError(
                `Please login using ${user.authProvider} authentication`,
                400
            );
        throw new CustomError(
            `Password operations are not allowed for ${user.authProvider} accounts`,
            400
        );
    }

    next();
});

export default ensureLocalAuth;
