const express = require('express');
const router = express.Router();

router.use(require('./ticker_list'));
router.use(require('./ticker_link'));
router.use(require('./ticker_unlink'));

module.exports = router;
