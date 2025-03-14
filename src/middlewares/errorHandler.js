const { apiResponse } = require('../utils/apiResponse');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    } else if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        statusCode = 503;
        message = 'Service Unavailable';
    }

    return apiResponse(res, statusCode, message);
};

module.exports = errorHandler;