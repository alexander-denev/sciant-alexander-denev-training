const express = require('express');
const router = express.Router();

router.post('/login_user', async (req, res) => {
  // Check credentials
  let { email, hash } = req.body;
  let loginResult = await req.myPostgres.login_user(email, hash);

  // Give token if credentials match
  res.status(loginResult.statusCode);
  if (loginResult.statusCode === 200) {
    const token = req.myJwt.createToken({ email: email });
    res.json({ accessToken: token, userData: loginResult.userData });
  } else {
    res.send(loginResult.error ? loginResult.error : null);
  }
});

module.exports = router;
