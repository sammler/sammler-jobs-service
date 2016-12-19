
class JobsController {

  static get(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ts: new Date().toJSON(), bla: 'test'});
  }

}

module.exports = JobsController;
