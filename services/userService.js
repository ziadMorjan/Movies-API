import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";

// Create (Signup)
export const createUser = async (data) => {
    const user = await User.create(data);
    return user;
};

// Get all users
export const getAllUsers = async () => {
    return await User.find();
};

// Get single user
export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new CustomError("User not found", 404);
    return user;
};

// Update user profile
export const updateUser = async (id, data) => {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new CustomError("User not found", 404);
    return user;
};

// Delete user
export const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new CustomError("User not found", 404);
    return user;
};
