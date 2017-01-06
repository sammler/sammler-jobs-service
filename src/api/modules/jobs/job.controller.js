const JobsBL = require('./jobs.bl');
const HttpStatus = require('http-status-codes');

class JobController {

  // Todo: Hey, that's just a placeholder
  static get(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ts: new Date().toJSON()});
  }

  static post(req, res) {
    JobsBL.save(req.body)
      .then(result => {
        res.status(HttpStatus.CREATED).send(result);
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      });
  }
}

module.exports = JobController;
