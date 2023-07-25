// Swagger
const path = require('path');
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const specs = yaml.load(path.resolve(__dirname, '../openapi.yaml'));

// Express
const express = require('express');
const router = express.Router();

router.use(swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;
