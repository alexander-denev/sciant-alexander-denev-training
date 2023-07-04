const { Pool } = require('pg');
class Options {

    async construct() {

        this.pool = new Pool({
            user: 'root',
            password: 'root',
            host: 'localhost',
            port: 5432,
            database: 'baza'
        });

        try {
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY, 
                    email VARCHAR(255) UNIQUE, 
                    hash VARCHAR(255),
                    session_data VARCHAR(255)
                )
                `);
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS tickers (
                    id SERIAL PRIMARY KEY,
                    symbol VARCHAR(255),
                    name VARCHAR(255)
                    )
            `);
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS user_tickers (
                    user_id INT REFERENCES users(id),
                    ticker_id INT REFERENCES tickers(id)
                )
            `);
            await this.pool.query(`
                CREATE TABLE IF NOT EXISTS ticker_data (
                    ticker_id INT REFERENCES tickers(id),
                    at TIMESTAMP,
                    price INT
                )
            `);
        } catch (error) {
            console.error(error);
        }
    }
    
    async create_user(email, password) {

        await this.construct();
        
        try {
            await this.pool.query(`
                INSERT INTO users (email, hash)
                VALUES ($1, $2)`, [email, password]);
        } catch (error) {
            console.log(error);
        }
    }

    async login_user(email, password) {

        await this.construct();

        try {
            await this.pool.query(`
                SELECT hash FROM users WHERE email = $1
            `, [email], (error, result) => {
                if (result.rows[0]) {
                    if (result.rows[0]["hash"] === password) {
                        console.log("Password matches");
                    } else {
                        console.log("Password mismatches");
                }
                } else {
                    console.log("User doesn't exist");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}



const options = new Options();

if (!process.argv[2]) {
    console.log("Options are: create_user, login_user");
} else {
    if (options[process.argv[2]] && typeof options[process.argv[2]] === "function") {
        options[process.argv[2]](process.argv[3], process.argv[4]);
    } else {
        console.log("Invalid option. Options are: create_user, login_user");
    }
}