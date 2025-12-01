import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";

// Login
export const authenticateUser = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new CustomError("Invalid email or password", 401);

    const match = await bcryptjs.compare(password, user.password);
    if (!match) throw new CustomError("Invalid email or password", 401);

    user.password = undefined;
    return user;
};
