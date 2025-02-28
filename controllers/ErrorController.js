function globalErrorHandler(error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    if (process.env.NODE_ENV == "development") {
        devError(error, res);
    }
    else if (process.env.NODE_ENV == "production") {
        prodError(error, res);
    }
}

function asyncErrorHandler(asyncFunc) {
    return (req, res, next) => {
        asyncFunc(req, res, next).catch(err => next(err));
    }
}

function devError(error, res) {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: error.stack
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

module.exports = {
    globalErrorHandler,
    asyncErrorHandler
}