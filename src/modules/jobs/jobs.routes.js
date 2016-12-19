const express = require('express');
const JobsController = require('./jobs.controller');

function routes() {
  const router = express.Router(); // eslint-disable-line new-cap

  router.get('/', JobsController.get);
}

module.exports = routes;
