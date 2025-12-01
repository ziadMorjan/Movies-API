import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";

import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from "../services/userService.js";

// Get all
export const getUsersController = asyncErrorHandler(async (req, res) => {
    const users = await getAllUsers();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: users,
    });
});

// Get one
export const getUserController = asyncErrorHandler(async (req, res) => {
    const user = await getUserById(req.params.id);

    res.status(200).json({
        status: "success",
        data: user,
    });
});

// Update user
export const updateUserController = asyncErrorHandler(async (req, res) => {
    const user = await updateUser(req.params.id, req.body);

    res.status(200).json({
        status: "success",
        data: user,
    });
});

// Delete user
export const deleteUserController = asyncErrorHandler(async (req, res) => {
    await deleteUser(req.params.id);

    res.status(204).send();
});
