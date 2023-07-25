const express = require('express');
const router = express.Router();

router.use(require('./ticker_list'));

module.exports = router;
