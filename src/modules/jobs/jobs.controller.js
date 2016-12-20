const JobsBL = require('./jobs.bl');
const HttpStatus = require('http-status-codes');

class JobsController {

  static get(req, res) {
    return JobsBL.getJobs()
      .then(result => {
        res.status(HttpStatus.OK)
        res.json(result);
      });
  }

  static count(req, res) {
    return JobsBL.count()
      .then(result => {
        res.status(HttpStatus.CREATED);
        res.json({count: result});
      });
  }

  /**
   * Post multiple jobs.
   * @param req
   * @param res
   * @returns {*}
   */
  static post(req, res) {
    return JobsBL.save(req.body)
      .then(result => {
        res.status(HttpStatus.CREATED);
        res.json(result);
      });
  }

}

module.exports = JobsController;
