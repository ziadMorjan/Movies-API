import { createToken } from "../utils/JWTs.js";
import { asyncErrorHandler } from "../middlewares/errorMiddleware.js";
import { authenticateUser } from "../services/authService.js";
import { createUser } from "../services/userService.js";

export const signupController = asyncErrorHandler(async (req, res) => {
    const user = await createUser(req.body);
    const token = createToken(user._id);

    res.status(201).json({
        status: "success",
        token,
        data: { user },
    });
});

export const loginController = asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);
    const token = createToken(user._id);

    res.status(200).json({
        status: "success",
        token,
        data: { user },
    });
});
