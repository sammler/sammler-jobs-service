const ExpressResult = require('express-result');

// const JobsHistoryModel = require('./jobs-history.model').Model;

class JobsHistoryController {

  static async post(req, res) {
    ExpressResult.error(res, new Error('not implemented'));
  }

}

module.exports = JobsHistoryController;
