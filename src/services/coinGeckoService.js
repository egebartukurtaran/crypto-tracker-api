// Fetches data from the CoinGecko API
// Implements caching to reduce API calls
// Formats responses for consistency
// Provides functions for:
// Getting all coin prices
// Getting detailed data for a specific coin
// Listing exchanges
// Retrieving historical price data
const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config');

// Initialize cache with TTL from config
const cache = new NodeCache({ stdTTL: config.cacheTTL });

// Base URL for CoinGecko API
const COINGECKO_API = config.apis.coinGecko;

/**
 * Get current prices for all supported cryptocurrencies
 * @returns {Promise<Object>} Object with coin data
 */
async function getAllPrices() {
    const cacheKey = 'all_prices';

    // Check if we have cached data
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                ids: config.supportedCoins.join(','),
                order: 'market_cap_desc',
                per_page: 100,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            }
        });

        // Format the data
        const formattedData = response.data.map(coin => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            image: coin.image,
            current_price: coin.current_price,
            market_cap: coin.market_cap,
            market_cap_rank: coin.market_cap_rank,
            price_change_24h: coin.price_change_percentage_24h,
            last_updated: coin.last_updated
        }));

        // Store in cache
        cache.set(cacheKey, formattedData);

        return formattedData;
    } catch (error) {
        console.error('Error fetching prices from CoinGecko:', error.message);
        throw new Error('Failed to fetch cryptocurrency prices');
    }
}

/**
 * Get current price for a specific cryptocurrency
 * @param {string} coinId - CoinGecko ID for the coin
 * @returns {Promise<Object>} Coin data including price
 */
async function getCoinPrice(coinId) {
    const cacheKey = `coin_${coinId}`;

    // Check if we have cached data
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(`${COINGECKO_API}/coins/${coinId}`, {
            params: {
                localization: false,
                tickers: true,
                market_data: true,
                community_data: false,
                developer_data: false
            }
        });

        // Extract required data
        const data = {
            id: response.data.id,
            symbol: response.data.symbol.toUpperCase(),
            name: response.data.name,
            image: response.data.image.large,
            market_cap_rank: response.data.market_cap_rank,
            current_price: response.data.market_data.current_price,
            market_cap: response.data.market_data.market_cap,
            total_volume: response.data.market_data.total_volume,
            high_24h: response.data.market_data.high_24h,
            low_24h: response.data.market_data.low_24h,
            price_change_24h: response.data.market_data.price_change_percentage_24h,
            price_change_7d: response.data.market_data.price_change_percentage_7d,
            price_change_30d: response.data.market_data.price_change_percentage_30d,
            exchanges: response.data.tickers.map(ticker => ({
                exchange: ticker.market.name,
                pair: ticker.base + '/' + ticker.target,
                price: ticker.last,
                volume: ticker.volume,
                timestamp: ticker.timestamp,
                trust_score: ticker.trust_score
            })).slice(0, 10), // Top 10 exchanges only
            last_updated: response.data.last_updated
        };

        // Store in cache
        cache.set(cacheKey, data);

        return data;
    } catch (error) {
        console.error(`Error fetching price for ${coinId} from CoinGecko:`, error.message);
        throw new Error(`Failed to fetch data for ${coinId}`);
    }
}

/**
 * Get list of exchanges supported by CoinGecko
 * @returns {Promise<Array>} Array of exchange data
 */
async function getExchanges() {
    const cacheKey = 'exchanges';

    // Check if we have cached data
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(`${COINGECKO_API}/exchanges`);

        // Format the data
        const formattedData = response.data.slice(0, 20).map(exchange => ({
            id: exchange.id,
            name: exchange.name,
            url: exchange.url,
            image: exchange.image,
            trust_score: exchange.trust_score,
            trust_score_rank: exchange.trust_score_rank,
            trade_volume_24h_btc: exchange.trade_volume_24h_btc
        }));

        // Store in cache
        cache.set(cacheKey, formattedData);

        return formattedData;
    } catch (error) {
        console.error('Error fetching exchanges from CoinGecko:', error.message);
        throw new Error('Failed to fetch exchanges');
    }
}

/**
 * Get historical price data for a specific coin
 * @param {string} coinId - CoinGecko ID for the coin
 * @param {number} days - Number of days of historical data
 * @returns {Promise<Array>} Historical price data
 */
async function getHistoricalData(coinId, days = 7) {
    const cacheKey = `historical_${coinId}_${days}`;

    // Check if we have cached data
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await axios.get(`${COINGECKO_API}/coins/${coinId}/market_chart`, {
            params: {
                vs_currency: 'usd',
                days: days
            }
        });

        // Format the data
        const formattedData = response.data.prices.map(priceData => ({
            timestamp: priceData[0],
            price: priceData[1]
        }));

        // Store in cache
        cache.set(cacheKey, formattedData);

        return formattedData;
    } catch (error) {
        console.error(`Error fetching historical data for ${coinId} from CoinGecko:`, error.message);
        throw new Error(`Failed to fetch historical data for ${coinId}`);
    }
}

module.exports = {
    getAllPrices,
    getCoinPrice,
    getExchanges,
    getHistoricalData
};