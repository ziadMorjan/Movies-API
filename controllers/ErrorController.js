function globalErrorHandler(error, req, res, next) {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
}
module.exports = {
    globalErrorHandler
}