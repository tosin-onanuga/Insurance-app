const successResponse = (statusCode, message, data = null, res) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data,
  });
};

const errorResponse = (statusCode, error, res) => {
  return res.status(statusCode).json({
    success: false,
    error: error,
  });
};

module.exports = { successResponse, errorResponse };
