import CustomError from "../utils/CustomError.js";

function asyncErrorHandler(asyncFunc) {
    return (req, res, next) => {
        asyncFunc(req, res, next).catch(err => next(err));
    }
}

function globalErrorHandler(error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if (process.env.NODE_ENV == "development")
        devError(error, res);
    else if (process.env.NODE_ENV == "production") {
        if (error.name == "CastError") error = CastErrorHandler(error);
        if (error.code == 11000) error = DuplicateKeyHandler(error);
        if (error.name == "ValidationError") error = ValidationErrorHandler(error);
        if (error.name == "JsonWebTokenError") error = JsonWebTokenErrorHandler();
        if (error.name == "TokenExpiredError") error = TokenExpiredErrorHandler();

        prodError(error, res);
    }
}

function devError(error, res) {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error
    });
}

function prodError(error, res) {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message

        });
    } else {
        res.status(500).json({
            status: "error",
            message: "There is some thing wrong! pleas try again later."
        });
    }
}

function CastErrorHandler(error) {
    return new CustomError(`Invalid value for field ${error.path}: ${error.value}`, 400);
}

function DuplicateKeyHandler(error) {
    let key = Object.keys(error.keyValue)[0];
    let value = error.keyValue[Object.keys(error.keyValue)[0]];
    return new CustomError(`There is already document with ${key}: ${value}`, 400);
}

function ValidationErrorHandler(error) {
    let message = Object.values(error.errors).map(value => value.message).join(". ");
    return new CustomError(`Validations Error: ${message}`, 400);
}

function JsonWebTokenErrorHandler() {
    return new CustomError("Invalid token! Please login.", 401);
}

function TokenExpiredErrorHandler() {
    return new CustomError("Token is expired! Please login again.", 401);
}

export {
    globalErrorHandler,
    asyncErrorHandler
};
