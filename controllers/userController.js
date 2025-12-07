import cookieOptions from "../utils/cookieOptions.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updateMe,
    changeUserPassword,
} from "../services/userService.js";
import { createToken } from "../utils/JWTs.js";

export const getUsersController = asyncErrorHandler(async (req, res) => {
    const users = await getAllUsers();
    res.status(200).json({ status: "success", results: users.length, data: users });
});

export const createUserController = asyncErrorHandler(async (req, res) => {
    const user = await createUser(req.body);
    res.status(201).json({ status: "success", data: user });
});

export const getUserController = asyncErrorHandler(async (req, res) => {
    const user = await getUserById(req.params.id);
    res.status(200).json({ status: "success", data: user });
});

export const updateUserController = asyncErrorHandler(async (req, res) => {
    const user = await updateUser(req.params.id, req.body);
    res.status(200).json({ status: "success", data: user });
});

export const deleteUserController = asyncErrorHandler(async (req, res) => {
    await deleteUser(req.params.id);
    res.status(204).send();
});

export const updateMeController = asyncErrorHandler(async (req, res) => {
    const user = await updateMe(req.user._id, req.body);
    res.status(200).json({ status: "success", data: user });
});

export const changePasswordController = asyncErrorHandler(async (req, res) => {
    const { newPassword } = req.body;

    await changeUserPassword(req.user._id, newPassword);

    const token = createToken(req.user._id);

    res.
        cookie("token", token, cookieOptions)
        .status(200)
        .json({
            status: "success",
            message: "Password changed successfully",
        });
});
