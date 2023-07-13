const express = require('express');
const router = express.Router();

router.use(require('./ticker/ticker_POST'));
router.use(require('./ticker/ticker_GET'));
router.use(require('./ticker/ticker_PATCH'));
router.use(require('./ticker/ticker_DELETE'));

module.exports = router;
