const JobsBL = require('./jobs.bl');
const HttpStatus = require('http-status-codes');


function handleError(res, err) {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR);
  res.json(err);
}

class JobsController {

  static getAll(req, res) {
    return JobsBL.getJobs()
      .then(result => {
        res.status(HttpStatus.OK);
        res.json(result);
      })
      .catch(err => handleError(res, err));
  }

  static getByStatus(status, req, res) {
    return JobsBL.getJobsByStatus(status)
      .then(result => {
        res.status(HttpStatus.OK);
        res.json(result);
      })
      .catch(err => handleError.bind(null, res, err));
  }

  static getSingle(req, res) {
    return JobsBL.getJobById(req.params.id)
      .then(result => {
        res.status(HttpStatus.OK);
        res.json(result);
      })
      .catch(err => handleError.bind(null, res, err));
  }

  static count(req, res) {
    return JobsBL.count()
      .then(result => {
        res.status(HttpStatus.CREATED);
        res.json({count: result});
      })
      .catch(err => handleError(res, err));
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
      .catch(err => handleError(res, err));
  }

  static patch(req, res) {
    return JobsBL.patch(req.params.id, req.body)
      .then(result => {
        res.status(HttpStatus.OK);
        res.json(result);
      })
      .catch(err => handleError(res, err));
  }

  static patchStatus(req, res) {
    return JobsBL.patch(req.params.id, req.body)
      .then(result => {
        res.status(HttpStatus.OK);
        res.json(result);
      })
      .catch(err => handleError(res, err));
  }

  static delete(req, res) {
    return JobsBL.remove(req.params.id)
      .then(result => {
        res.status(HttpStatus.OK).send(result);
      })
      .catch(err => handleError(res, err));
  }
}

module.exports = JobsController;
