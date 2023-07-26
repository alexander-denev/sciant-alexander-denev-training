const express = require('express');
const router = express.Router();

const pool = require('../../pool');

router.get('/', async (req, res) => {
  const userId = req.authObject.userId;

  try {
    const queryResult = await pool.query('SELECT userdata FROM users WHERE id = $1', [userId]);
    res.status(200).json({ userData: queryResult.rows[0].userdata });
  } catch (error) {
    console.log(error.stack);
    res.sendStatus(500);
  }
});

module.exports = router;
