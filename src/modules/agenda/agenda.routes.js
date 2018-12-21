const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

const AgendaController = require('./agenda.controller');
const verifyJwtToken = require('./../../middleware/verifyJwtToken');

/**
 * @swagger
 *
 * definitions:
 *   Job:
 *   type: object
 *   properties:
 *     job_id:
 *     tenant_id:
 *     user_id:
 *     processor:
 *     subject:
 *     repeatPattern:
 */

/**
 * @swagger
 *
 * /jobs:
 *   get:
 *     description: Return all jobs for the current user.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *     responses:
 *       200:
 *         description: Returns the jobs.
 *
 */
router.get('/v1/jobs', verifyJwtToken, AgendaController.getUserJobs);

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
 *     responses:
 *       201:
 *         description: Job created successfully.
 *
 */
router.post('/v1/jobs', verifyJwtToken, AgendaController.postJob);

/**
 * @swagger
 *
 * /jobs:
 *   delete:
 *     description: Delete all jobs of the currently authenticated user.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *     responses:
 *       200:
 *         description: All jobs for the user deleted successfully.
 */
router.delete('/v1/jobs', verifyJwtToken, AgendaController.deleteByUser);

router.delete('/v1/jobs/by', verifyJwtToken, AgendaController.delete);

module.exports = router;
