const express = require('express');
const router = express.Router();

router.post('/:id', async (req, res) => {
  const tickerId = req.params.id;
  const userId = req.authObject.userId;

  try {
    const tickerExist = (await req.pool.query('SELECT id FROM tickers WHERE id = $1', [tickerId])).rows[0] ? true : false;

    if (tickerExist) {
      await req.pool.query('INSERT INTO user_tickers (user_id, ticker_id) VALUES ($1, $2)', [userId, tickerId]);
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch {
    res.sendStatus(409);
  }
});

module.exports = router;
