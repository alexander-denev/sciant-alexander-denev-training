const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { tickerId } = req.body;
  const userId = req.authObject.userId;

  try {
    req.pool.query('INSERT INTO user_tickers (user_id, ticker_id) VALUES ($1, $2)', [userId, tickerId])

    res.sendStatus(200);
  } catch (error) {
    res.status(409).json({ error: error });
  }

  // try {
  //   await client.query('BEGIN');
  //   const tickerId = (await client.query('INSERT INTO tickers (symbol, name) VALUES ($1, $2) RETURNING id', [symbol, name]))
  //     .rows[0].id;
  //   await client.query('INSERT INTO ticker_data (ticker_id, at, price) VALUES ($1, $2, $3)', [
  //     tickerId,
  //     Math.floor(Date.now() / 1000), // convert current timestamp to seconds
  //     price,
  //   ]);
  //   await client.query('INSERT INTO user_tickers (user_id, ticker_id) VALUES ($1, $2)', [userId, tickerId]);

  //   await client.query('COMMIT');

  //   res.sendStatus(200);
  // } catch (error) {
  //   await client.query('ROLLBACK');
  //   res.status(500).json({ error: error });
  // } finally {
  //   client.release();
  // }
});

module.exports = router;
