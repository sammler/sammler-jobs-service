const JobsBL = require('./jobs.bl');

class JobsController {

  static get(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ts: new Date().toJSON(), bla: 'test'});
  }

  static count(req, res) {
    return JobsBL.count()
      .then((result) => {
        res.status(200);
        res.json({count: result});
      });
  }

}

module.exports = JobsController;
