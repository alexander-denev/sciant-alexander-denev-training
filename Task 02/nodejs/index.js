try {require('dotenv').config();} catch {}

// Create postgres connection
const { Pool } = require('pg');
const env = process.env;
const pool = new Pool({
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_DB
});
const MPC = require("./mypgcontroller");
const pg = new MPC(pool);



    // Rest API

// Import
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Define constants
const app = express();
const port = 5555;

// Session config
const secret = crypto.randomBytes(32).toString('hex');
const refresh_secret = crypto.randomBytes(32).toString('hex');

// Middleware
app.use(express.json());



// Start listening
app.post('/create_user', async (req, res) => {
    console.log("create post");

    let { email, hash } = req.body;
    res.status(await pg.create_user(email, hash));
    res.send(); 
});

app.post('/login_user', async (req, res) => {
    console.log("login post");

    let { email, hash } = req.body;
    let statusCode = await pg.login_user(email, hash);
    res.status(statusCode);

    //JWT
    if (statusCode=200) {

        const user = { username: email };
        
        const accesssToken = jwt.sign(user, secret);
        res.json({ accesssToken: accesssToken });

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