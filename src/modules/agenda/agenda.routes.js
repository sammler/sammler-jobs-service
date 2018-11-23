const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const AgendaController = require('./agenda.controller');

/**
 * @swagger
 *
 * /jobs:
 *   get:
 *     description: Return all jobs.
 *
 */
router.get('/v1/jobs', AgendaController.getJobs);

router.post('/v1/jobs', AgendaController.postJob);

module.exports = router;
