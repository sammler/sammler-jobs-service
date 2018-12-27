const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap

// const JobsHistoryController = require('./jobs-history.controller');
const verifyJwtToken = require('../../middleware/verifyJwtToken');

router.post('/v1/jobs-history', verifyJwtToken);

module.exports = router;
