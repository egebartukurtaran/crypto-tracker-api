const marketAggregatorService = require('../services/marketAggregatorService');
const asyncHandler = require('../utils/asyncHandler');
const { apiResponse } = require('../utils/apiResponse');

/**
 * Get price comparison across exchanges for a specific coin
 * @route GET /api/markets/:coinId
 * @access Public
 */
const getMarketComparison = asyncHandler(async (req, res) => {
    const { coinId } = req.params;
    const { symbol } = req.query;

    // If no symbol is provided, try to use coinId
    const symbolToUse = symbol || coinId.substring(0, 3);

    const data = await marketAggregatorService.getMarketComparison(coinId, symbolToUse);
    return apiResponse(res, 200, `Market comparison for ${data.name} retrieved successfully`, data);
});

/**
 * Get arbitrage opportunities
 * @route GET /api/arbitrage
 * @access Public
 */
const getArbitrageOpportunities = asyncHandler(async (req, res) => {
    const { minPercentage = 1.0 } = req.query;

    const data = await marketAggregatorService.findArbitrageOpportunities(parseFloat(minPercentage));
    return apiResponse(res, 200, `Found ${data.length} arbitrage opportunities`, data);
});

module.exports = {
    getMarketComparison,
    getArbitrageOpportunities
};