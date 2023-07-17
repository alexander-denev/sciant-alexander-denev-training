// Swagger
const path = require('path');
const apiSpec = path.resolve(__dirname, '../openapi.yaml');

const OpenApiValidator = require('express-openapi-validator');

// Express
const express = require('express');
const router = express.Router();

router.use(
  OpenApiValidator.middleware({
    apiSpec,
    validateRequests: true, // (default)
    validateResponses: true, // false by default
  })
);

module.exports = router;
