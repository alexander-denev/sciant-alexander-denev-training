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
const Myjwt = require('./myjwt');
const cors = require('cors');

// Define constants
const app = express();
const port = 5555;

// Session config
const myjwt = new Myjwt();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*"
}))

// Start listening
app.post('/create_user', myjwt.authenticateToken.bind(myjwt), async (req, res) => {

    let { email, hash } = req.body;
    res.sendStatus(await pg.create_user(email, hash));

});

app.post('/login_user', async (req, res) => {

    // Check credentials
    let { email, hash } = req.body;
    let statusCode = await pg.login_user(email, hash);

    // Give token if credentials match
    if (statusCode === 200) {

        res.status(statusCode);
        myjwt.sendToken(res, {
            username: email
        });

    } else {
        res.sendStatus(statusCode);
    }
});

app.get('/test', myjwt.authenticateToken.bind(myjwt), (req, res) => {
    res.send("Authenticated!");
});

app.listen(port, () => {
    console.log('Node listening on port ' + port);
});