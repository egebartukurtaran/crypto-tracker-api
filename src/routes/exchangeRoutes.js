const express = require('express');
const { getExchanges } = require('../controllers/exchangeController');

const router = express.Router();

// Get list of supported exchanges
router.get('/', getExchanges);

module.exports = router;