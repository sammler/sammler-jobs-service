const express = require('express');
const HealthCheckController = require('./health-check.controller');

function routes() {
  const router = express.Router(); // eslint-disable-line new-cap

  router.get('/', HealthCheckController.get);

  return router;
}

module.exports = routes;
