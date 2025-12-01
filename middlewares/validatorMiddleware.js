import { validationResult } from "express-validator";
import CustomError from "../utils/CustomError.js"

export default function validatorMiddleware(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const message = errors
            .array()
            .map(el => el.msg)
            .join(' | ');
        return next(new CustomError(message, 400));
    }

    next();
}
