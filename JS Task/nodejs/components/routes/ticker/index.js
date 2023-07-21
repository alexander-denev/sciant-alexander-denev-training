const express = require('express');
const router = express.Router();

router.use(require('./ticker_link'));
router.use(require('./ticker_list'));
router.use(require('./ticker_update'));
router.use(require('./ticker_delete'));

module.exports = router;
