const express = require('express');
const router = express.Router();

router.use(require('./routes/user'));
router.use(require('./routes/ticker'));

module.exports = router;
