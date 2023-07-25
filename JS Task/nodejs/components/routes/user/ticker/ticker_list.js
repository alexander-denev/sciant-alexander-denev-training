const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.authObject.userId;
  const limit = req.body.limit || 100;
  const offset = req.body.offset || 0;

  try {
    const result = (
      await req.pool.query(
        `
          SELECT td.ticker_id AS id, t.symbol, td.price
          FROM ticker_data td
          INNER JOIN user_tickers ut ON ut.ticker_id = td.ticker_id
          INNER JOIN tickers t ON td.ticker_id = t.id
          WHERE ut.user_id = $1
          AND at IN (
            SELECT max(at)
            FROM ticker_data
            GROUP BY ticker_id)
          ORDER BY td.ticker_id ASC
          LIMIT $2
          OFFSET $3
          `,
        [userId, limit, offset]
      )
    ).rows;
    
    res.status(200).json({ result });
  } catch (error) {
    console.log(error.stack);
    res.sendStatus(500);
  }
});

module.exports = router;
