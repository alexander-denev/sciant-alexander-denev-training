const { Pool } = require('pg');
const argon2 = require('argon2');

class Options {

    async connection() {

        if (!this.pool) {
            this.pool = new Pool({
                user: 'root',
                password: 'root',
                host: 'postgres',
                port: 5432,
                database: 'baza'
            });
        }
    }
    
    async create_user(email, password) {

        await this.connection();
        
        try {
            let hash = await argon2.hash(password);
            await this.pool.query(`INSERT INTO users (email, hash) VALUES ($1, $2)`, [email, hash]);
            return 200;

        } catch (error) {
            console.log(error);
            return 409;
        }
    }

    async login_user(email, password) {

        await this.connection();

        try {
            let queryresult = await this.pool.query(`
                SELECT hash FROM users WHERE email = $1
            `, [email]);
            
            if (queryresult.rows[0]) {
                let argonresult = await argon2.verify(queryresult.rows[0]['hash'], password);
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




    // Rest API

// Import
const express = require('express');
const session = require('express-session');

// Define constants
const options = new Options();
const app = express();
const port = 5555;

// Set session secret
app.use(session({
    secret: "verysecretsecret",
    saveUninitialized: false
}));

// Start listening
app.post('/create_user', async (req, res) => {
    console.log("create post");
    res.send(await options.create_user(req.query.email, req.query.hash));
});

app.post('/login_user', async (req, res) => {
    console.log("login post");
    res.send(await options.login_user(req.query.email, req.query.hash));
});

app.listen(port, () => {
    console.log('listening on port ' + port);
});