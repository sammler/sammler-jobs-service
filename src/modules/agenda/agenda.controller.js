const expressResult = require('express-result');
const AgendaWrapper = require('./index');

class AgendaController {

  /**
   * Get the jobs for the currently authenticated user.
   */
  static async getUserJobs(req, res) {
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
