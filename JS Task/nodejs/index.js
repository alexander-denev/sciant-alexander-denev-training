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

// Define constants
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const port = env.RESTAPI_PORT || 5555;

// Import component dependencies
const myJwt = new (require('./components/myjwt'))();

app.use((req, res, next) => {
  req.myJwt = myJwt;
  req.pool = pool;
  next();
});

// Middleware
app.use(express.json());
app.use(express.text());
app.use(cors({ origin: '*' }));

// Api documentation and validator
app.use(require('./api'));

// Routes
app.use(require('./components/routes'));

// Websockets
// require('./components/websockets')(server, myJwt, pool);

// Start server
server.listen(port, () => {
  console.log('Node listening on port ' + port);
});
