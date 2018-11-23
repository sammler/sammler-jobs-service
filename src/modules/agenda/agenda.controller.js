const expressResult = require('express-result');
const AgendaWrapper = require('./index');

class AgendaController {

  static async getJobs(req, res) {
    let agendaWrapper = await AgendaWrapper.instance();
    let jobs = await agendaWrapper.agenda.jobs();
    return expressResult.ok(res, jobs);
  }

  static async postJob(req, res) {
    // Let agendaWrapper = await AgendaWrapper.instance();
    return expressResult.ok(res);

  }

}

module.exports = AgendaController;
