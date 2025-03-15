const express = require('express');
const { getMarketComparison, getArbitrageOpportunities } = require('../controllers/marketController');

const router = express.Router();

// Get price comparison across exchanges for a specific coin
router.get('/:coinId', getMarketComparison);

module.exports = router;