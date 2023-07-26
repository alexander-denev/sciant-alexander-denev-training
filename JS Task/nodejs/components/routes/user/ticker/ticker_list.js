const express = require('express');
const router = express.Router();

const pool = require('../../../pool');

router.get('/', async (req, res) => {
  const userId = req.authObject.userId;
  const limit = req.body.limit || 100;
  const offset = req.body.offset || 0;

  try {
    const result = (
      await pool.query(
        // The credits for this query go to Kristian Oreshkov
        `
          SELECT t.id, t.symbol, td.price 
          FROM tickers AS t 

          JOIN (
            SELECT ticker_id, MAX(at) AS max_at 
            FROM ticker_data 
            GROUP BY ticker_id
          ) AS a 
          ON t.id = a.ticker_id 

          JOIN ticker_data AS td 
          ON t.id = td.ticker_id 
          AND a.max_at = td.at

          LEFT JOIN user_tickers AS ut
          ON ut.ticker_id = t.id

          WHERE ut.user_id = $1

          ORDER BY t.id ASC

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
