const coinGeckoService = require('../services/coinGeckoService');
const asyncHandler = require('../utils/asyncHandler');
const { apiResponse } = require('../utils/apiResponse');

/**
 * Get all cryptocurrency prices
 * @route GET /api/prices
 * @access Public
 */
const getPrices = asyncHandler(async (req, res) => {
    const data = await coinGeckoService.getAllPrices();
    return apiResponse(res, 200, 'Cryptocurrency prices retrieved successfully', data);
});

/**
 * Get price for a specific cryptocurrency
 * @route GET /api/prices/:coinId
 * @access Public
 */
const getCoinPrice = asyncHandler(async (req, res) => {
    const { coinId } = req.params;
    const data = await coinGeckoService.getCoinPrice(coinId);
    return apiResponse(res, 200, `Price data for ${data.name} retrieved successfully`, data);
});

/**
 * Get historical price data for a specific cryptocurrency
 * @route GET /api/historical/:coinId
 * @access Public
 */
const getHistoricalData = asyncHandler(async (req, res) => {
    const { coinId } = req.params;
    const { days = 7 } = req.query;

    const data = await coinGeckoService.getHistoricalData(coinId, days);
    return apiResponse(res, 200, `Historical data for ${coinId} retrieved successfully`, data);
});

module.exports = {
    getPrices,
    getCoinPrice,
    getHistoricalData
};