const successResponse = (statusCode, message, res) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
    });
};

const errorResponse = (statusCode, error, res) => {
    return res.status(statusCode).json({
        success: false,
        error: error,
    });
};

module.exports = { successResponse, errorResponse };
