const express = require('express');
const router = express.Router();

router.get(
  '/ticker',
  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },
  async (req, res) => {}
);

module.exports = router;
