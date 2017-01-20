const JobsBL = require('./jobs.bl');
const HttpStatus = require('http-status-codes');

class JobController {

  static post(req, res) {
    JobsBL.createSingle(req.body)
      .then(result => {
        res.status(HttpStatus.CREATED).send(result);
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  static patch(req, res) {
    JobsBL.update(req.params.id, req.body)
      .then(result => {
        res.status(HttpStatus.OK).send(result);
      });

  }

  static delete(req, res) {
    JobsBL.remove(req.params.id)
      .then(result => {
        res.status(HttpStatus.OK).send(result);
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }

  static changeStatus(req, res) {

  }
}

module.exports = JobController;
