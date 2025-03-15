const coinGeckoService = require('../services/coinGeckoService');
const asyncHandler = require('../utils/asyncHandler');
const { apiResponse } = require('../utils/apiResponse');

/**
 * Get list of supported exchanges
 * @route GET /api/exchanges
 * @access Public
 */
const getExchanges = asyncHandler(async (req, res) => {
    const data = await coinGeckoService.getExchanges();
    return apiResponse(res, 200, 'Exchanges retrieved successfully', data);
});

module.exports = {
    getExchanges
};