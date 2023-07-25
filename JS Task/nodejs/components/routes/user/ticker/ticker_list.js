const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.authObject.userId;
  const limit = req.body.limit || 100;
  const offset = req.body.offset || 0;

  try {
    // Get the ids of the tickers the user is linked to
    const tickerIds = (
      await req.pool.query('SELECT ticker_id FROM user_tickers WHERE user_id = $1 OFFSET $2 LIMIT $3', [userId, offset, limit])
    ).rows.map((obj) => obj.ticker_id);

    // If the user is linked to any tickers, else return and empty array
    if (tickerIds.length) {
      const tickerIdsAsParams = tickerIds.map((_, i) => `$${i + 1}`).join(',');
      const resultTickers = (
        await req.pool.query(`SELECT * FROM tickers WHERE id IN (${tickerIdsAsParams}) ORDER BY id ASC`, tickerIds)
      ).rows;

      const resultTickerPrices = (
        await req.pool.query(
          `
            SELECT ticker_id, price
            FROM ticker_data
            WHERE at IN (
                SELECT max(at)
                FROM ticker_data
                WHERE ticker_id = ANY($1::integer[])
                GROUP BY ticker_id
            ) AND ticker_id = ANY($1::integer[])
            ORDER BY ticker_id
          `,
          [tickerIds]
        )
      ).rows;

      var resultFinal = resultTickers.map((obj, i) => {
        obj.price = Number(resultTickerPrices[i].price);
        return obj;
      });
    } else {
      var resultFinal = [];
    }

    res.status(200).json({ result: resultFinal });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
