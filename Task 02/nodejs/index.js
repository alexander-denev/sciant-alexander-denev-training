// Create postgres connection
const { Pool } = require('pg');
const env = process.env;
const pool = new Pool({
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    database: env.POSTGRES_DB,
});

// Rest API

// Import
const express = require('express');
const cors = require('cors');
const Myjwt = require('./myjwt');
const MyPostgresController = require('./mypgcontroller');

// Define constants
const myPostgres = new MyPostgresController(pool);
const myJwt = new Myjwt();
const app = express();
const port = 5555;

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: '*',
    })
);

// Start listening
app.post(
    '/create_user',
    myJwt.authenticateToken.bind(myJwt),
    async (req, res) => {
        let { email, hash } = req.body;
        res.sendStatus(await myPostgres.create_user(email, hash));
    }
);

app.post('/login_user', async (req, res) => {
    // Check credentials
    let { email, hash } = req.body;
    let statusCode = await myPostgres.login_user(email, hash);

    // Give token if credentials match
    if (statusCode === 200) {
        res.status(statusCode);
        myJwt.sendToken(res, {
            username: email,
        });
    } else {
        res.sendStatus(statusCode);
    }
});

app.get('/test', myJwt.authenticateToken.bind(myJwt), (req, res) => {
    res.send('Authenticated!');
});

app.listen(port, () => {
    console.log('Node listening on port ' + port);
});
