const express = require('express');
const router = express.Router();

router.get(
  '/test_auth',
  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },
  (req, res) => {
    res.send('Authenticated!');
  }
);
// router.get('/test_auth', myJwt.authenticateToken.bind(myJwt), (req, res) => {
//   res.send('Authenticated!');
// });

module.exports = router;
