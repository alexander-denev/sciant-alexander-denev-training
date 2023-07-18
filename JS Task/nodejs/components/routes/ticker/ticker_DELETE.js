const express = require('express');
const router = express.Router();

router.delete('/:id', async (req, res) => {
  const userId = req.authObject.userId;
  const tickerId = req.params.id;

  try {
    const queryResult = await req.pool.query('SELECT * FROM user_tickers WHERE user_id = $1 AND ticker_id = $2', [
      userId,
      tickerId,
    ]);

    if (queryResult.rows.length) {
      // User with userId owns the ticker
      await req.pool.query('DELETE FROM user_tickers WHERE user_id = $1 AND ticker_id = $2', [userId, tickerId]);

      res.sendStatus(200);
    } else {
      // User with userId doesn't own the ticker
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ error: error.stack });
  }
});

module.exports = router;
