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
 *     job_identifier:
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
router.get('/v1/jobs', verifyJwtToken, AgendaController.getMine);

/**
 * @swagger
 *
 * /jobs:
 *   get:
 *     description: Return a count of all jobs for the currently authenticated user.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *     responses:
 *       200:
 *         description: Returns the jobs.
 *
 */
router.get('/v1/jobs/count', verifyJwtToken, AgendaController.countMine);

/**
 * @swagger
 *
 * /jobs:
 *   post:
 *     description: Post a job.
 *     Each job has the following three constraints:
 *       - tenant_id
 *       - user_id
 *       - job_identifier
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
router.delete('/v1/jobs', verifyJwtToken, AgendaController.deleteMine);

/**
 * @swagger
 *
 * /jobs/all:
 *   delete:
 *     description: Delete all jobs. Only valid for users assigned to role `system`.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *     responses:
 *       200:
 *         description: All jobs for the user deleted successfully.
 */
router.delete('/v1/jobs/all', verifyJwtToken, AgendaController.deleteAll);

/**
 * @swagger
 *
 * /jobs:
 *   delete:
 *     description: Delete a job by a given id.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *     responses:
 *       200:
 *         description: All jobs for the user deleted successfully.
 */
router.delete('/v1/jobs/:job_id', verifyJwtToken, AgendaController.deleteByJobId);

/**
 * @swagger
 *
 * /jobs:
 *   delete:
 *     description: Delete a job by a job_identifier for the currently authenticated user.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *     responses:
 *       200:
 *         description: All jobs for the user deleted successfully.
 */
router.delete('/v1/jobs/job_identifier/:job_identifier', verifyJwtToken, AgendaController.deleteMineByJobIdentifier);

/**
 * @swagger
 *
 * /jobs:
 *   delete:
 *     description: Delete all jobs by data.nats.channel for the currently authenticated user.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *     responses:
 *       200:
 *         description: All jobs for the user deleted successfully.
 */
router.delete('/v1/jobs/nats/channel/:channel', verifyJwtToken, AgendaController.deleteMineByNatsChannel);

/**
 * @swagger
 *
 * /jobs/tenant/:tenant_id:
 *   delete:
 *     description: Delete all jobs of the given tenant.
 *     produces:
 *       - application/json
 *     tags:
 *       - jobs
 *     responses:
 *       200:
 *         description: All jobs for the user deleted successfully.
 */
router.delete('/v1/jobs/tenant/:tenant_id', verifyJwtToken, AgendaController.deleteByTenantId);

module.exports = router;
