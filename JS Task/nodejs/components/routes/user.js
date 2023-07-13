const express = require('express');
const router = express.Router();

router.use(require('./user/login_user'));
router.use(require('./user/create_user'));
router.use(require('./user/test_auth'));

module.exports = router;
