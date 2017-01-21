const express = require('express');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');

const pkg = require('./../../package.json');
const HealthCheckController = require('./modules/health-check/health-check.controller');
const JobsController = require('./modules/jobs/jobs.controller');

function init(app) {
  const router = express.Router(); // eslint-disable-line new-cap
  const version = 'v1';

  router.get('/health-check', HealthCheckController.get);

  router.get(`/${version}/jobs`, JobsController.getAll);
  router.get(`/${version}/jobs/aborted`, JobsController.getByStatus.bind(null, 'aborted'));
  router.get(`/${version}/jobs/idle`, JobsController.getByStatus.bind(null, 'idle'));
  router.get(`/${version}/jobs/running`, JobsController.getByStatus.bind(null, 'running'));
  router.get(`/${version}/jobs/timeout`, JobsController.getByStatus.bind(null, 'timeout'));
  router.get(`/${version}/jobs/completed`, JobsController.getByStatus.bind(null, 'completed'));
  router.get(`/${version}/jobs/:id`, JobsController.getSingle);
  router.delete(`/${version}/jobs/:id`, JobsController.delete);
  router.post(`/${version}/jobs`, JobsController.post);
  router.post(`${version}/jobs/count`, JobsController.count);
  router.patch(`/${version}/jobs/:id`, JobsController.patch);
  router.patch(`/${version}/jobs/:id/status`, JobsController.patchStatus);

  app.use('/', router);

  const swaggerDoc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './config/api-docs.yml'), 'utf8'));
  swaggerDoc.info.version = pkg.version;
  app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

}

module.exports = {
  init
};
