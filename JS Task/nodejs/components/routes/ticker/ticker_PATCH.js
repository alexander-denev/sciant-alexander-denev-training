const express = require('express');
const router = express.Router();

router.patch(
  '/ticker/:id',
  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },
  async (req, res) => {
    req.params.id;
  }
);

module.exports = router;
