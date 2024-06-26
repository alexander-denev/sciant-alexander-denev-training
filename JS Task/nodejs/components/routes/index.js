const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));

router.use(
  '/user',

  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },

  require('./user')
);

router.use(
  '/ticker',

  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },

  require('./ticker')
);

module.exports = router;
