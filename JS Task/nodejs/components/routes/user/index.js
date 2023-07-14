const express = require('express');
const router = express.Router();

router.use(require('./create'));
router.use(require('./fetchUserdata'));

module.exports = router;
