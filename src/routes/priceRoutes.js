const express = require('express');
const { getPrices, getCoinPrice, getHistoricalData } = require('../controllers/priceController');

const router = express.Router();

// Get all cryptocurrency prices
router.get('/', getPrices);

// Get price for a specific cryptocurrency
router.get('/:coinId', getCoinPrice);

// Get historical price data for a specific cryptocurrency
router.get('/historical/:coinId', getHistoricalData);

module.exports = router;