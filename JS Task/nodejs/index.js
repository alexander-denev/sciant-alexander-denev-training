// For development purposes
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env_debug') });

// Define constants
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const port = process.env.RESTAPI_PORT || 5555;

// Import component dependencies
const myJwt = new (require('./components/myjwt'))();

app.use((req, res, next) => {
  req.myJwt = myJwt;
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
require('./components/websockets')(server, myJwt);

// Start server
server.listen(port, () => {
  console.log('Node listening on port ' + port);
});
