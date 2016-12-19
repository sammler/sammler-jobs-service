const JobsBL = require('./jobs.bl');

class JobController {

  static get(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ts: new Date().toJSON()});
  }

  static post(req, res) {
    JobsBL.createOrUpdate(req.body)
      .then( (result) => {
        res.status(200).send(result);
      });
  }

}

module.exports = JobController;
