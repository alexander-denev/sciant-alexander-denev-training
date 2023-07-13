const express = require('express');
const router = express.Router();

router.post(
  '/ticker',
  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },
  async (req, res) => {}
);

module.exports = router;
