const express = require('express');
const JobController = require('./job.controller');

function routes() {
  const router = express.Router(); // eslint-disable-line new-cap

  router.get('/', JobController.get);
}

module.exports = routes;
