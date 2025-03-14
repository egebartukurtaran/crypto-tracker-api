/**
 * Standard API response formatter
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {Object|Array} data - Response data
 * @returns {Object} Formatted response
 */
const apiResponse = (res, statusCode, message, data = null) => {
    const response = {
        success: statusCode < 400,
        message,
        timestamp: new Date().toISOString()
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

module.exports = {
    apiResponse
};