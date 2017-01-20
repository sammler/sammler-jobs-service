const express = require('express');
const HealthCheckController = require('./modules/health-check/health-check.controller');
const JobController = require('./modules/jobs/job.controller');
const JobsController = require('./modules/jobs/jobs.controller');

function init(app) {
  const router = express.Router(); // eslint-disable-line new-cap
  const version = 'v1';

  router.get('/health-check', HealthCheckController.get);

  router.post(`/${version}/job`, JobController.post);
  router.delete(`/${version}/job/:id`, JobController.delete);

  router.get(`/${version}/jobs`, JobsController.getAll);
  router.get(`/${version}/jobs/:id`, JobsController.getSingle);
  router.delete(`/${version}/jobs/:id`, JobController.delete);
  router.post(`/${version}/jobs`, JobsController.post);
  router.post(`${version}/jobs/count`, JobsController.count);

  router.patch(`/${version}/jobs/:id/status`, JobsController.patchStatus);

  app.use('/', router);
}

module.exports = {
  init
};
