function globalErrorHandler(error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
}

function asyncErrorHandler(asyncFunc) {
    return (req, res, next) => {
        asyncFunc(req, res, next).catch(err => next(err));
    }
}

module.exports = {
    globalErrorHandler,
    asyncErrorHandler
}