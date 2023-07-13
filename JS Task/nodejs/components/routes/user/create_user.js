const express = require('express');
const router = express.Router();

router.post(
  '/create_user',
  (req, res, next) => {
    req.myJwt.authenticateToken(req, res, next);
  },
  async (req, res) => {
    let { email, hash, userData } = req.body;
    const createUserResult = await req.myPostgres.create_user(email, hash, userData);
    res.status(createUserResult.statusCode);
    res.send(createUserResult.error ? createUserResult.error : null);
  }
);

module.exports = router;
