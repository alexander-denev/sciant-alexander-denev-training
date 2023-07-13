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

// Define constants
const app = express();
const port = 5555;

// Import component dependencies
const myPostgres = new (require('./components/mypgcontroller'))(pool);
const myJwt = new (require('./components/myjwt'))();

app.use((req, res, next) => {
  req.myPostgres = myPostgres;
  req.myJwt = myJwt;
  next();
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use(require('./components/routes'));

app.listen(port, () => {
  console.log('Node listening on port ' + port);
});
