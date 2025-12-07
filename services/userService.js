import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";
import bcrypt from "bcryptjs";

// Create user
export const createUser = async (data) => {
    return await User.create(data);
};

// Get all users
export const getAllUsers = async () => {
    return await User.find();
};

// Get one user
export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new CustomError("User not found", 404);
    return user;
};

// Admin updates any user
export const updateUser = async (id, data) => {
    const user = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });

    if (!user) throw new CustomError("User not found", 404);
    return user;
};

// Delete user
export const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new CustomError("User not found", 404);
};

// User self-update (profile)
export const updateMe = async (userId, body) => {
    const allowedFields = ["firstName", "lastName", "email", "photo"];

    const filtered = {};
    Object.keys(body).forEach((key) => {
        if (allowedFields.includes(key)) filtered[key] = body[key];
    });

    const user = await User.findByIdAndUpdate(userId, filtered, {
        new: true,
        runValidators: true,
    });

    return user;
};

// Change password safely
export const changeUserPassword = async (userId, newPassword) => {
    const user = await User.findById(userId).select("+password");

    if (!user) throw new CustomError("User not found", 404);

    user.password = newPassword;
    user.passwordChangedAt = Date.now();

    await user.save();

    return user;
};
