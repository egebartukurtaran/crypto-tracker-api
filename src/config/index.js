module.exports = {
    // Server configuration
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Cache configuration
    cacheTTL: process.env.CACHE_TTL || 60, // seconds

    // Supported exchanges
    exchanges: ['binance', 'coinbase', 'kraken'],

    // Supported cryptocurrencies
    supportedCoins: ['bitcoin', 'ethereum', 'ripple', 'litecoin', 'cardano', 'polkadot', 'chainlink'],

    // External API endpoints
    apis: {
        coinGecko: 'https://api.coingecko.com/api/v3',
        binance: 'https://api.binance.com/api/v3'
    }
};