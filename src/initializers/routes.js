const express = require('express');
const swaggerUi = require('swagger-ui-express');

const ApiDocsController = require('./../modules/api-docs/api-docs.controller');
const router = express.Router(); // eslint-disable-line new-cap

router.use('/', require('./../modules/health-check/health-check.routes'));
router.use('/', require('./../modules/api-docs/api-docs.routes'));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(ApiDocsController.getDocs()));

module.exports = {
  configure: app => {
    app.use(router);
  }
};
