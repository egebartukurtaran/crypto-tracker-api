const express = require('express');
const priceRoutes = require('./priceRoutes');
const exchangeRoutes = require('./exchangeRoutes');
const marketRoutes = require('./marketRoutes');
const arbitrageRoutes = require('./arbitrageRoutes');

const router = express.Router();

// Define routes
router.use('/prices', priceRoutes);
router.use('/exchanges', exchangeRoutes);
router.use('/markets', marketRoutes);
router.use('/arbitrage', arbitrageRoutes);

module.exports = router;