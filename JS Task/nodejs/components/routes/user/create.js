const express = require('express');
const router = express.Router();

const pool = require('../../pool');

const argon2 = require('argon2');

router.post('/', async (req, res) => {
  try {
    const { email, password, userData } = req.body;

    const hash = await argon2.hash(password);

    const queryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (queryResult.rows.length) {
      // User already exists
      res.sendStatus(409);
    } else {
      // User doesn't exist, so create it
      await pool.query(`INSERT INTO users (email, hash, userdata) VALUES ($1, $2, $3)`, [email, hash, userData]);
      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error.stack);
    res.sendStatus(500);
  }
});

module.exports = router;
