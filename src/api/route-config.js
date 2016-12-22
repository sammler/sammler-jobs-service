const express = require('express');
const HealthCheckController = require('./modules/health-check/health-check.controller');
const JobController = require('./modules/jobs/job.controller');
const JobsController = require('./modules/jobs/jobs.controller');

function init(app) {
  const router = express.Router(); // eslint-disable-line new-cap
  const version = 'v1';

  router.get('/health-check', HealthCheckController.get);

  router.post(`/${version}/job`, JobController.post);

  router.get(`/${version}/jobs`, JobsController.getAll);
  router.get(`/${version}/jobs/:_id`, JobsController.getSingle);
  router.post(`/${version}/jobs`, JobsController.post);
  router.post(`${version}/jobs/count`, JobsController.count);

  app.use('/', router);
}

module.exports = {
  init
};
