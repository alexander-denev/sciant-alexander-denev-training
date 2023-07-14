const express = require('express');
const router = express.Router();

router.patch('/:id', async (req, res) => {
  const userId = req.authObject.userId;
  const tickerId = req.params.id;
  const price = req.body.price;

  try {
    const queryResult = await req.pool.query('SELECT * FROM user_tickers WHERE user_id = $1 AND ticker_id = $2', [
      userId,
      tickerId,
    ]);

    if (queryResult.rows.length) {
      // User with userId owns the ticker
      await req.pool.query('INSERT INTO ticker_data (ticker_id, at, price) VALUES ($1, $2, $3)', [
        tickerId,
        Math.floor(Date.now() / 1000),
        price,
      ]);
      res.sendStatus(200);
    } else {
      // User with userId doesn't own the ticker
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
