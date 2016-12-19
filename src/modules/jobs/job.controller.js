
class JobController {

  static get(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ts: new Date().toJSON()});
  }

}

module.exports = JobController;
