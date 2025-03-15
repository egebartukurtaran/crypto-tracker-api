const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config');

// Initialize cache
const cache = new NodeCache({ stdTTL: config.cacheTTL });

// Base URL for Binance API
const BINANCE_API = config.apis.binance;

/**
 * Get current prices for supported cryptocurrencies from Binance
 * @returns {Promise<Array>} Array of coin price data
 */
async function getAllPrices() {
    const cacheKey = 'binance_prices';

    // Check cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        // Get ticker prices for all symbols
        const response = await axios.get(`${BINANCE_API}/ticker/price`);

        // Filter for USDT pairs that we're interested in
        const relevantPairs = response.data.filter(pair => {
            // Example: looking for BTCUSDT, ETHUSDT, etc.
            const symbol = pair.symbol;
            return symbol.endsWith('USDT') &&
                config.supportedCoins.some(coin =>
                    symbol.toLowerCase().startsWith(coin.substring(0, 3).toLowerCase())
                );
        });

        // Format the data
        const formattedData = relevantPairs.map(pair => {
            const baseAsset = pair.symbol.replace('USDT', '');
            return {
                symbol: baseAsset,
                pair: pair.symbol,
                price: parseFloat(pair.price),
                exchange: 'Binance',
                last_updated: new Date().toISOString()
            };
        });

        // Store in cache
        cache.set(cacheKey, formattedData);

        return formattedData;
    } catch (error) {
        console.error('Error fetching data from Binance:', error.message);
        throw new Error('Failed to fetch data from Binance');
    }
}

/**
 * Get detailed ticker data for a specific symbol
 * @param {string} symbol - The cryptocurrency symbol (e.g., "BTC")
 * @returns {Promise<Object>} Detailed ticker data
 */
async function getCoinData(symbol) {
    const cacheKey = `binance_${symbol.toUpperCase()}`;

    // Check cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const ticker = await axios.get(`${BINANCE_API}/ticker/24hr`, {
            params: {
                symbol: `${symbol.toUpperCase()}USDT`
            }
        });

        const formattedData = {
            symbol: symbol.toUpperCase(),
            pair: ticker.data.symbol,
            price: parseFloat(ticker.data.lastPrice),
            price_change_24h: parseFloat(ticker.data.priceChangePercent),
            high_24h: parseFloat(ticker.data.highPrice),
            low_24h: parseFloat(ticker.data.lowPrice),
            volume_24h: parseFloat(ticker.data.volume),
            exchange: 'Binance',
            last_updated: new Date().toISOString()
        };

        // Store in cache
        cache.set(cacheKey, formattedData);

        return formattedData;
    } catch (error) {
        console.error(`Error fetching data for ${symbol} from Binance:`, error.message);
        throw new Error(`Failed to fetch data for ${symbol} from Binance`);
    }
}

module.exports = {
    getAllPrices,
    getCoinData
};