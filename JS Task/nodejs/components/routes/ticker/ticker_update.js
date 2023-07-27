const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
  const userId = req.authObject.userId;
  const tickerId = req.params.id;
  const { symbol, name, price } = req.body;

  const client = await req.pool.connect();
  try {
    const queryResult = await client.query('SELECT * FROM user_tickers WHERE user_id = $1 AND ticker_id = $2', [
      userId,
      tickerId,
    ]);

    if (queryResult.rows.length) {
      // User with userId owns the ticker
      await client.query('BEGIN');

      await client.query('INSERT INTO ticker_data (ticker_id, at, price) VALUES ($1, $2, $3)', [
        tickerId,
        Math.floor(Date.now() / 1000),
        price,
      ]);

      await client.query('UPDATE tickers SET symbol = $1, name = $2 WHERE id = $3', [symbol, name, tickerId]);

      await client.query('COMMIT');

      res.sendStatus(200);
    } else {
      // User with userId doesn't own the ticker
      res.sendStatus(403);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error });
  } finally {
    client.release();
  }
});

module.exports = router;
