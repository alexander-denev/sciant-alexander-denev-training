const express = require('express');
const router = express.Router();

router.delete(
  '/ticker/:id',
  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },
  async (req, res) => {
    req.params.id;
  }
);

module.exports = router;
