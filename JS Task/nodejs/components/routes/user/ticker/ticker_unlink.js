const express = require('express');
const router = express.Router();

const pool = require('../../../pool');

router.delete('/:id', async (req, res) => {
  const tickerId = req.params.id;
  const userId = req.authObject.userId;

  try {
    const tickerExist = (
      await pool.query('SELECT ticker_id FROM user_tickers WHERE user_id = $1 AND ticker_id = $2', [userId, tickerId])
    ).rows[0]
      ? true
      : false;

    if (tickerExist) {
      await pool.query('DELETE FROM user_tickers WHERE user_id = $1 AND ticker_id = $2', [userId, tickerId]);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error.stack);
    res.sendStatus(500);
  }
});

module.exports = router;
