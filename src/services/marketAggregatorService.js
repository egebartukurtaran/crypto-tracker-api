const coinGeckoService = require('./coinGeckoService');
const binanceService = require('./binanceService');

/**
 * Get prices from all configured exchanges
 * @returns {Promise<Object>} Combined price data
 */
async function getAggregatedPrices() {
    try {
        // Fetch data from all sources in parallel
        const [coinGeckoData, binanceData] = await Promise.all([
            coinGeckoService.getAllPrices(),
            binanceService.getAllPrices()
        ]);

        return {
            coingecko: coinGeckoData,
            binance: binanceData
        };
    } catch (error) {
        console.error('Error aggregating market data:', error.message);
        throw new Error('Failed to aggregate market data');
    }
}

/**
 * Get price comparison for a specific coin across exchanges
 * @param {string} coinId - CoinGecko ID for the coin
 * @param {string} symbol - Trading symbol (e.g., "BTC")
 * @returns {Promise<Object>} Price comparison data
 */
async function getMarketComparison(coinId, symbol) {
    try {
        // Get data from multiple sources in parallel
        const [coinGeckoData, binanceData] = await Promise.all([
            coinGeckoService.getCoinPrice(coinId),
            binanceService.getCoinData(symbol).catch(() => null) // Handle case where symbol isn't on Binance
        ]);

        // Extract exchange data from CoinGecko
        const exchanges = coinGeckoData.exchanges || [];

        // Add Binance data if available
        if (binanceData) {
            exchanges.push({
                exchange: 'Binance',
                pair: binanceData.pair,
                price: binanceData.price,
                volume: binanceData.volume_24h,
                trust_score: 'green', // Binance is generally trusted
            });
        }

        // Sort by price
        const sortedExchanges = exchanges.sort((a, b) => a.price - b.price);

        // Calculate price differences and arbitrage opportunities
        const lowestPrice = sortedExchanges[0]?.price || 0;
        const highestPrice = sortedExchanges[sortedExchanges.length - 1]?.price || 0;
        const priceDifference = highestPrice - lowestPrice;
        const percentageDifference = lowestPrice > 0 ? (priceDifference / lowestPrice) * 100 : 0;

        return {
            id: coinId,
            symbol: symbol.toUpperCase(),
            name: coinGeckoData.name,
            exchanges: sortedExchanges,
            price_comparison: {
                lowest: {
                    price: lowestPrice,
                    exchange: sortedExchanges[0]?.exchange || 'Unknown'
                },
                highest: {
                    price: highestPrice,
                    exchange: sortedExchanges[sortedExchanges.length - 1]?.exchange || 'Unknown'
                },
                difference: priceDifference,
                difference_percentage: percentageDifference.toFixed(2)
            },
            last_updated: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error comparing markets for ${coinId}:`, error.message);
        throw new Error(`Failed to compare markets for ${coinId}`);
    }
}

/**
 * Find arbitrage opportunities across all coins and exchanges
 * @param {number} minPercentage - Minimum percentage difference to qualify as an opportunity
 * @returns {Promise<Array>} List of arbitrage opportunities
 */
async function findArbitrageOpportunities(minPercentage = 1.0) {
    try {
        // Get CoinGecko coins
        const coins = await coinGeckoService.getAllPrices();

        // Check each coin for arbitrage opportunities
        const opportunities = [];

        for (const coin of coins) {
            // Skip coins without symbols
            if (!coin.symbol) continue;

            try {
                const comparison = await getMarketComparison(coin.id, coin.symbol);

                // If difference percentage exceeds threshold, it's an opportunity
                if (parseFloat(comparison.price_comparison.difference_percentage) >= minPercentage) {
                    opportunities.push({
                        id: coin.id,
                        symbol: coin.symbol,
                        name: coin.name,
                        difference_percentage: comparison.price_comparison.difference_percentage,
                        buy_from: comparison.price_comparison.lowest,
                        sell_at: comparison.price_comparison.highest,
                        potential_profit_per_coin: comparison.price_comparison.difference
                    });
                }
            } catch (error) {
                // Skip this coin if there's an error
                console.error(`Skipping ${coin.id} due to error:`, error.message);
            }
        }

        // Sort by highest percentage difference
        return opportunities.sort((a, b) =>
            parseFloat(b.difference_percentage) - parseFloat(a.difference_percentage)
        );
    } catch (error) {
        console.error('Error finding arbitrage opportunities:', error.message);
        throw new Error('Failed to find arbitrage opportunities');
    }
}

module.exports = {
    getAggregatedPrices,
    getMarketComparison,
    findArbitrageOpportunities
};