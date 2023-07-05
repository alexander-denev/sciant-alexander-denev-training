const { Pool } = require('pg');
const argon2 = require('argon2');
const express = require('express');

class Options {

    async connection() {

        if (!this.pool) {
            this.pool = new Pool({
                user: 'root',
                password: 'root',
                host: '172.17.0.2',
                port: 5432,
                database: 'baza'
            });
        }
    }
    
    async create_user(email, password) {

        await this.connection();
        
        try {

            await argon2.hash(password).then(async hash => {
                await this.pool.query(`
                    INSERT INTO users (email, hash)
                    VALUES ($1, $2)`, [email, hash])
                    .then(() => {
                        return "OK";
                    });
            });

        } catch (error) {
            console.log(error);
        }
    }

    async login_user(email, password) {

        await this.connection();

        try {
            let result = await this.pool.query(`
                SELECT hash FROM users WHERE email = $1
            `, [email]);
            let hash = result.rows[0]['hash'];

            if (result.rows[0]) {
                await argon2.verify(hash, password).then(result => {
                    if (result) {
                        return 1;
                    } else {
                        return 0;
                    }
                }).catch(error => {console.log(error);});
            } else {
                return -1;
            }
        } catch (error) {
            console.log(error);
        }
    }
}



// Rest API
const options = new Options();
const app = express();
const port = 5555;

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