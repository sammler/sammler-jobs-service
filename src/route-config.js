const healthCheckRoutes = require('./modules/health-check/health-check.routes');

function init(app) {
  app.use('/health-check', healthCheckRoutes());
}

module.exports = {
  init
};
