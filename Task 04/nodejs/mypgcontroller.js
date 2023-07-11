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
      const queryResult = await this.pool.query(
        `
                SELECT hash, userdata FROM users WHERE email = $1
            `,
        [email]
      );

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

  async ticker_create(symbol, name) {
    if (!symbol || !name) {
      return { statusCode: 400 };
    }
    const queryResult = await this.pool.query('SELECT symbol FROM tickers WHERE symbol = $1', [symbol]);
    if (queryResult.rows[0]['symbol']) {
      return { statusCode: 409 };
    } else {
      try {
        await this.pool.query('INSERT INTO tickers (symbol, name) VALUES ($1, $2)', [symbol, name]);
        return { statusCode: 200 };
      } catch (error) {
        return { statusCode: 500, error: error };
      }
    }
  }

  async ticker_read() {}

  async ticker_update() {}

  async ticker_delete(symbol) {
    if (symbol) {
      try {
        await this.pool.query('DELETE FROM tickers WHERE symbol = $1', [symbol]);
        return { statusCode: 200 };
      } catch (error) {
        return { statusCode: 500, error: error };
      }
    } else {
      return { statusCode: 400 };
    }
  }

  async ticker_list(start = 0, limit = 100) {
    if (typeof start !== 'number' || typeof limit !== 'number') {
      return { statusCode: 400 };
    }
    try {
      const queryResult = await this.pool.query('SELECT symbol, name FROM tickers OFFSET $1 LIMIT $2', [start, limit]);
      return { statusCode: 200, result: queryResult };
    } catch (error) {
      return { statusCode: 500, error: error };
    }
  }
}

module.exports = Main;
