const healthCheckRoutes = require('./modules/health-check/health-check.routes');
const jobRoutes = require('./modules/jobs/job.routes');
const jobsRoutes = require('./modules/jobs/jobs.routes');

function init(app) {
  app.use('/health-check', healthCheckRoutes());
  app.use('/job', jobRoutes());
  app.use('/jobs', jobsRoutes());
}

module.exports = {
  init
};
