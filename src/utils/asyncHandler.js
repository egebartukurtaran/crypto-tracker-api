/**
 * Async handler to eliminate try-catch blocks in route handlers
 * @param {Function} fn - Function to be wrapped
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;