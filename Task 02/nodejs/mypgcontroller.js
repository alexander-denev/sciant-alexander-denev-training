const argon2 = require('argon2');

class Main {
    constructor(pool) {
        this.pool = pool;
    }

    async create_user(email, password) {
        try {
            let hash = await argon2.hash(password);
            await this.pool.query(
                `INSERT INTO users (email, hash) VALUES ($1, $2)`,
                [email, hash]
            );
            return 200;
        } catch (error) {
            console.log(error);
            return 409;
        }
    }

    async login_user(email, password) {
        try {
            let queryresult = await this.pool.query(
                `
                SELECT hash FROM users WHERE email = $1
            `,
                [email]
            );

            if (queryresult.rows[0]) {
                let argonresult = await argon2.verify(
                    queryresult.rows[0]['hash'],
                    password
                );
                if (argonresult) {
                    return 200;
                } else {
                    return 401;
                }
            } else {
                return 404;
            }
        } catch (error) {
            console.log(error);
            return 500;
        }
    }
}

module.exports = Main;
