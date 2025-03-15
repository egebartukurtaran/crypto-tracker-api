const express = require('express');
const { getArbitrageOpportunities } = require('../controllers/marketController');

const router = express.Router();

// Get arbitrage opportunities
router.get('/', getArbitrageOpportunities);

module.exports = router;