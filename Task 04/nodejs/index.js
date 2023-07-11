// For development purposes
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env_debug') });

// Create postgres connection
const { Pool } = require('pg');
const env = process.env;
const pool = new Pool({
  user: env.POSTGRES_USER || 'root',
  password: env.POSTGRES_PASSWORD || 'root',
  host: env.POSTGRES_HOST || 'localhost',
  port: env.POSTGRES_PORT || 5432,
  database: env.POSTGRES_DB || 'baza',
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
app.post('/create_user', myJwt.authenticateToken.bind(myJwt), async (req, res) => {
  let { email, hash, userData } = req.body;
  res.sendStatus((await myPostgres.create_user(email, hash, userData)).statusCode);
});

app.post('/login_user', async (req, res) => {
  // Check credentials
  let { email, hash } = req.body;
  let loginResult = await myPostgres.login_user(email, hash);

  // Give token if credentials match
  if (loginResult.statusCode === 200) {
    res.status(loginResult.statusCode);
    const token = myJwt.createToken({ email: email });
    res.json({ accessToken: token, userData: loginResult.userData });
  } else {
    res.sendStatus(loginResult.statusCode);
  }
});

app.get('/test', myJwt.authenticateToken.bind(myJwt), (req, res) => {
  res.send('Authenticated!');
});

app.listen(port, () => {
  console.log('Node listening on port ' + port);
});
