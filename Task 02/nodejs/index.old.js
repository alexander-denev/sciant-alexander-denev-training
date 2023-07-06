    // Database functions

// Import
const { Pool } = require('pg');
const argon2 = require('argon2');

// Create pg pool
const pool = new Pool({
    user: 'root',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'baza'
});

// The functions
async function create_user(email, password) {
    
    try {
        let hash = await argon2.hash(password);
        await pool.query(`INSERT INTO users (email, hash) VALUES ($1, $2)`, [email, hash]);
        return 200;

    } catch (error) {
        console.log(error);
        return 409;
    }
}

async function login_user(email, password) {


    try {
        let queryresult = await pool.query(`
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





    // Rest API

// Import
const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const PgSession = require('connect-pg-simple')(session);

// Define constants
const app = express();
const port = 5555;

// Session config
const secret = crypto.randomBytes(32).toString('hex');

// Middleware
app.use(express.json());
app.use(session({
    secret: secret,
    saveUninitialized: false,
    resave: false,
    store: new PgSession ({
        pool: pool,
        tableName: 'sessions'
    })
}));

// Start listening
app.post('/create_user', async (req, res) => {
    console.log("create post");

    if (req.session.isAuth) {
        let { email, hash } = req.body;
        res.status(await create_user(email, hash));
        res.send();  
    } else {
        res.status(401).send();
    }
});

app.post('/login_user', async (req, res) => {
    console.log("login post");

    let { email, hash } = req.body;
    let statusCode = await login_user(email, hash);
    res.status(statusCode);

    if (statusCode === 200) {
        req.session.isAuth = true;
        res.send();
    } else {
        res.send();
    }
});

app.get('/test', (req, res) => {
    if (req.session.isAuth) {
        res.send("Logged in!");
    } else {
        res.send("Not logged in!");
    }
    
});

app.listen(port, () => {
    console.log('Node listening on port ' + port);
});