const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const AgendaController = require('./agenda.controller');

/**
 * @swagger
 *
 * job:
 *   tenant_id:
 *   user_id:
 *   processor:
 *
 *
 * /jobs:
 *   get:
 *     description: Return all jobs for the current user.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *
 */
router.get('/v1/jobs', AgendaController.getUserJobs);

/**
 * @swagger
 *
 * /jobs:
 *   post:
 *     description: Post a job.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *
 */
router.post('/v1/jobs', AgendaController.postJob);

module.exports = router;
