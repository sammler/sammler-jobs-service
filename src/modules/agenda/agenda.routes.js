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
router.delete('/v1/jobs/:id', verifyJwtToken, AgendaController.deleteByJobId);

/**
 * /v1/jobs/by
 * Query param type=:
 * - tenant
 * - user_and_job_identifier
 */
// router.delete('/v1/jobs/by', verifyJwtToken, AgendaController.deleteBy);

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
