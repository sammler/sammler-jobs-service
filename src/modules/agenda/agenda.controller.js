const expressResult = require('express-result');
const AgendaWrapper = require('./index');
// Todo: Needs to be fixed in the long run ...
const _ = require('lodash'); // eslint-disable-line no-unused-vars

class AgendaController {

  /**
   * Get the jobs for the currently authenticated user.
   */
  static async getUserJobs(req, res) {
    let agendaWrapper = await AgendaWrapper.instance();
    let jobs = await agendaWrapper.agenda.jobs();
    return expressResult.ok(res, jobs);
  }

  // Todo: validation:
  //  - job.name is required => maps to the processor
  //  - repeatInterval is required
  //  - user_id is required
  //  - tenant_id is required
  //  - job.subject => really the subject of this jobs
  static async postJob(req, res) {
    let jobDataRaw = req.body;
    let agendaWrapper = await AgendaWrapper.instance();
    let mappedBody = AgendaController._mapJobInput(jobDataRaw);
    let jobRequest = await agendaWrapper.agenda.create(mappedBody.processor, mappedBody);
    jobRequest.repeatEvery(mappedBody.repeatPattern);
    jobRequest.unique({
      // Note: mappedBody.processor is automatically added to be a unique criteria
      'data.user_id': mappedBody.user_id,
      'data.tenant_id': mappedBody.tenant_id,
      'data.subject': mappedBody.subject
    });
    let newJob = await jobRequest.save();
    return expressResult.ok(res, AgendaController._mapJobOutput(newJob));
  }

  /**
   * Map the contents of the request body to what is required by agenda.
   *
   * @description
   * Explicitly pick the object we need, don't allow other items to be persisted.
   *
   * @private
   */
  static _mapJobInput(job) {
    return job; // Just let it through for now ...
    // return _.pick(job, [
    //   'processor',
    //   'user_id',
    //   'tenant_id',
    //   'subject'
    // ]);
  }

  static _mapJobOutput(job) {

    // Todo: Remove console.log
    console.log('_mapJobOutput:job', job);

    return {
      raw: job, // Todo: probably to removed
      processor: job.attrs.name,
      user_id: job.attrs.data.user_id,
      tenant_id: job.attrs.data.tenant_id,
      subject: job.attrs.data.subject
    };
  }

}

module.exports = AgendaController;
