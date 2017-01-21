const JobsBL = require('./jobs.bl');
const HttpStatus = require('http-status-codes');

class JobsController {

  static getAll(req, res) {
    return JobsBL.getJobs()
      .then(result => {
        res.status(HttpStatus.OK);
        res.json(result);
      });
  }

  static getByStatus(status, req, res) {
    return JobsBL.getJobsByStatus(status)
      .then(result => {
        res.status(HttpStatus.OK);
        res.json(result);
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json(err);
      });
  }

  static getSingle(req, res) {
    return JobsBL.getJobById(req.params.id)
      .then(result => {
        res.status(HttpStatus.OK);
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
    return JobsBL.create(req.body)
      .then(result => {
        res.status(HttpStatus.CREATED);
        res.json(result);
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json(err);
      });
  }

  static patch(req, res) {
    return JobsBL.patch(req.params.id, req.body)
      .then(result => {
        res.status(HttpStatus.OK);
        res.json(result);
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json(err);
      });
  }

  static patchStatus(req, res) {
    return JobsBL.patch(req.params.id, req.body)
      .then(result => {
        res.status(HttpStatus.OK);
        res.json(result);
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.json(err);
      });
  }

  static delete(req, res) {
    return JobsBL.remove(req.params.id)
      .then(result => {
        res.status(HttpStatus.OK).send(result);
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

}

module.exports = JobsController;
