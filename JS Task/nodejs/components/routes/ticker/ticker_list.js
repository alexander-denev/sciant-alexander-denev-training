const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const limit = req.body.limit || 100;
  const offset = req.body.offset || 0;

  try {
    const resultTickers = (
      await req.pool.query(`SELECT * FROM tickers ORDER BY id ASC OFFSET $1 LIMIT $2`, [offset, limit])
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

    res.status(200).json({ result: resultFinal });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
