const argon2 = require('argon2');

class Main {
  constructor(pool) {
    this.pool = pool;
  }

  async create_user(email, password, userData) {
    if (!email || !password || !userData) {
      return { statusCode: 400 };
    }
    try {
      let hash = await argon2.hash(password);
      await this.pool.query(`INSERT INTO users (email, hash, userdata) VALUES ($1, $2, $3)`, [email, hash, userData]);
      return { statusCode: 200 };
    } catch (error) {
      return { statusCode: 409, error: error };
    }
  }

  async login_user(email, password) {
    if (!email || !password) {
      return { statusCode: 400 };
    }
    try {
      const queryResult = await this.pool.query('SELECT hash, userdata FROM users WHERE email = $1', [email]);

      if (queryResult.rows[0]) {
        let argonresult;
        try {
          argonresult = await argon2.verify(queryResult.rows[0]['hash'], password);
        } catch {
          return { statusCode: 400 };
        }

        if (argonresult) {
          return { statusCode: 200, userData: queryResult.rows[0]['userdata'] };
        } else {
          return { statusCode: 401 };
        }
      } else {
        return { statusCode: 401 };
      }
    } catch (error) {
      return { statusCode: 500, error: error };
    }
  }

  async getUserId(email) {
    try {
      const queryResult = await this.pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (queryResult.rows[0]) {
        return { result: queryResult.rows[0].id, statusCode: 200 };
      } else {
        return { statusCode: 404 };
      }
    } catch (error) {
      return { statusCode: 500, error: error };
    }
  }

  async ticker_create(userId, { symbol, name, price }) {
    if (!userId || !symbol || !name || !price) {
      return { statusCode: 400 };
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const tickerId = (await client.query('INSERT INTO tickers (symbol, name) VALUES ($1, $2) RETURNING id', [symbol, name]))
        .rows[0].id;
      await client.query('INSERT INTO ticker_data (ticker_id, at, price) VALUES ($1, $2, $3)', [
        tickerId,
        Math.floor(Date.now() / 1000), // convert current timestamp to seconds
        price,
      ]);
      await client.query('INSERT INTO user_tickers (user_id, ticker_id) VALUES ($1, $2)', [userId, tickerId]);
      await client.query('COMMIT');
      return { statusCode: 200 };
    } catch (error) {
      await client.query('ROLLBACK');
      return { statusCode: 500, error: error };
    } finally {
      client.release();
    }
  }

  async ticker_list(userId, offset = 0, limit = 100) {
    if (typeof offset !== 'number' || typeof limit !== 'number') {
      return { statusCode: 400 };
    }
    try {
      const tickerIds = (
        await this.pool.query('SELECT ticker_id FROM user_tickers WHERE user_id = $1 OFFSET $2 LIMIT $3', [userId, offset, limit])
      ).rows.map((obj) => obj.ticker_id);
      const tickerIdsAsParams = tickerIds.map((_, i) => `$${i + 1}`).join(',');
      const resultTickers = (await this.pool.query(`SELECT * FROM tickers WHERE id IN (${tickerIdsAsParams})`, tickerIds)).rows;

      const resultTickerData = (
        await this.pool.query(
          `
          SELECT price
          FROM ticker_data
          WHERE at IN (
              SELECT max(at)
              FROM ticker_data
              WHERE ticker_id = ANY($1::integer[])
              GROUP BY ticker_id
          ) AND ticker_id = ANY($1::integer[])
          `,
          [tickerIds]
        )
      ).rows;

      const resultFinal = resultTickers.map((obj, i) => {
        obj.price = resultTickerData[i].price;
        return obj;
      });

      return { statusCode: 200, result: resultFinal };
    } catch (error) {
      return { statusCode: 500, error: error };
    }
  }

  async ticker_updatePrice(tickerId, price) {
    if (!tickerId || !price) {
      return { statusCode: 400 };
    }

    try {
      await this.pool.query('INSERT INTO ticker_data (ticker_id, at, price) VALUES ($1, $2, $3)', [
        tickerId,
        Math.floor(Date.now() / 1000),
        price,
      ]);
      return { statusCode: 200 };
    } catch (error) {
      return { statusCode: 500, error: error };
    }
  }

  async ticker_delete(userId, tickerId) {
    if (!userId || !tickerId) {
      return { statusCode: 400 };
    }

    try {
      await this.pool.query('DELETE FROM user_tickers WHERE user_id = $1 AND ticker_id = $2', [userId, tickerId]);
      return { statusCode: 200 };
    } catch (error) {
      return { statusCode: 500, error: error };
    }
  }
}

module.exports = Main;
