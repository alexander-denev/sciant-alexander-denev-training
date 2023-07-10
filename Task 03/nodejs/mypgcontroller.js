const argon2 = require('argon2');

class Main {
  constructor(pool) {
    this.pool = pool;
  }

  async create_user(email, password) {
    try {
      let hash = await argon2.hash(password);
      await this.pool.query(`INSERT INTO users (email, hash) VALUES ($1, $2)`, [email, hash]);
      return { statusCode: 200 };
    } catch (error) {
      console.log(error);
      return { statusCode: 409 };
    }
  }

  async login_user(email, password) {
    try {
      let queryresult = await this.pool.query(
        `
                SELECT hash, userdata FROM users WHERE email = $1
            `,
        [email]
      );

      if (queryresult.rows[0]) {
        let argonresult;
        try {
          argonresult = await argon2.verify(queryresult.rows[0]['hash'], password);
        } catch {
          return { statusCode: 400 };
        }

        if (argonresult) {
          return { statusCode: 200, userData: queryresult.rows[0]['userdata'] };
        } else {
          return { statusCode: 401 };
        }
      } else {
        return { statusCode: 401 };
      }
    } catch (error) {
      console.log(error);
      return { statusCode: 500 };
    }
  }
}

module.exports = Main;
