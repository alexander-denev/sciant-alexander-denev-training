const express = require('express');
const router = express.Router();

router.use(require('./user/create'));
router.use(require('./user/fetchUserdata'));

module.exports = router;
