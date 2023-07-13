const express = require('express');
const router = express.Router();

const argon2 = require('argon2');

router.post('/', async (req, res) => {
  try {
    const { email, password, userData } = req.body;
    const hash = await argon2.hash(password);

    await req.pool.query(`INSERT INTO users (email, hash, userdata) VALUES ($1, $2, $3)`, [email, hash, userData]);

    res.sendStatus(200);
  } catch (error) {
    res.status(409).json({ error: error });
  }
});

module.exports = router;
