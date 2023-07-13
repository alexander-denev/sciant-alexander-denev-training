const express = require('express');
const router = express.Router();

router.use('/login', require('./routes/login'));

router.use(
  '/user',

  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },

  require('./routes/user')
);

router.use(
  '/ticker',

  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },

  require('./routes/ticker')
);

module.exports = router;
