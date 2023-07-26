const express = require('express');
const router = express.Router();

const pool = require('../pool');

const argon2 = require('argon2');

router.post('/', async (req, res) => {
  let { email, password } = req.body;

  // Imported
  try {
    // Success running code
    const queryResult = await pool.query('SELECT id, hash FROM users WHERE email = $1', [email]);

    if (queryResult.rows[0]) {
      // User was found on the database
      const argonresult = await argon2.verify(queryResult.rows[0]['hash'], password);

      if (argonresult) {
        // Password matches the hash, stored in the database
        const token = req.myJwt.createToken({ userId: queryResult.rows[0]['id'] });
        res.status(200).json({ accessToken: token });
      } else {
        // Password doesn't match the hash
        res.sendStatus(401);
      }
    } else {
      // User was not found
      res.sendStatus(401);
    }
  } catch (error) {
    // Internal server error
    console.log(error.stack);
    res.sendStatus(500);
  }
});

module.exports = router;
