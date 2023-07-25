const express = require('express');
const router = express.Router();

router.use(require('./create'));
router.use(require('./fetchUserdata'));
router.use('/ticker', require('./ticker'));

module.exports = router;
