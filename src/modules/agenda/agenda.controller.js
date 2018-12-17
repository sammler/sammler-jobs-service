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

    let validationErrors = AgendaController._validateJob(mappedBody);
    if (validationErrors.length > 0) {
      return expressResult.error(res, {message: 'Invalid input, see `validationErrors', validationErrors});
    }

    let jobRequest = await agendaWrapper.agenda.create(mappedBody.processor, mappedBody);
    jobRequest.repeatEvery(mappedBody.repeatPattern);
    jobRequest.unique({
      // Note: mappedBody.processor is automatically added to be a unique criteria
      'data.user_id': mappedBody.user_id,
      'data.tenant_id': mappedBody.tenant_id,
      'data.subject': mappedBody.subject
    });
    try {
      let newJob = await jobRequest.save();
      return expressResult.created(res, AgendaController._mapJobOutput(newJob));
    } catch (err) {
      return expressResult.error(res, err);
    }
  }

  static async deleteJob(req, res) {
    return expressResult.ok(res);
  }

  /**
   * Deletes all jobs for the given user.
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  static async deleteByUser(req, res) {

    return expressResult.ok(res);
  }

  /**
   * Delete a job by:
   * - tenant_id - xxx
   * - user_id - xxx
   * - processor - e.g. nats.publish
   * - subject - e.g. strategy-hearbeat_every_week
   */
  static async deleteBy(req /* , res */) {

    // Todo: Test if the user is legitimated to delete this record

    let name = req.body.processor;
    let user_id = req.user.user_id;
    let tenant_id = req.user.tenant_id;
    let subject = req.body.subject;

    let agendaWrapper = await AgendaWrapper.instance();
    let agenda = agendaWrapper.agenda;

    agenda.cancel(
      {
        name: name,
        'data.user_id': user_id,
        'data.tenant_id': tenant_id,
        'data.subject': subject
      }
    );
    // Todo: missing result here
  }

  // Todo: authentication + check
  static async removeAll() {
    let agendaWrapper = await AgendaWrapper.instance();
    let agenda = agendaWrapper.agenda;
    const jobs = await agenda.jobs();

    await Promise.all(jobs.map(async job => {
      try {
        await job.remove();
      } catch (e) {
        console.error('Error deleting a job', e);
      }
    }));
  }

  /**
   * Just an overall count of all jobs being stored.
   */
  static async count() {
    let agendaWrapper = await AgendaWrapper.instance();
    let agenda = agendaWrapper.agenda;
    const jobs = await agenda.jobs();
    return jobs.length;
  }

  static _validateJob(job) {

    let errors = [];

    if (!job.user_id) {
      errors.push(`Argument 'user_id' cannot be null or empty.`);
    }
    if (!job.tenant_id) {
      errors.push(`Argument 'tenant_id' cannot be null or empty.`);
    }
    if (!job.subject) {
      errors.push(`Argument 'subject' cannot be null or empty.`);
    }
    if (!job.processor) {
      errors.push(`Argument 'processor' cannot be null or empty.`);
    }
    if (!job.repeatPattern) {
      errors.push(`Argument 'repeatPattern' cannot be null or empty.`);
    }
    return errors;

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
    // console.log('_mapJobOutput:job', job);

    return {
      raw: job, // Todo: probably to removed
      job_id: job.attrs._id,
      processor: job.attrs.name,
      user_id: job.attrs.data.user_id,
      tenant_id: job.attrs.data.tenant_id,
      subject: job.attrs.data.subject,
      repeatPattern: job.attrs.data.repeatPattern,
      data: _.omit(job.attrs.data, ['processor', 'user_id', 'tenant_id', 'subject']) // Do not expose the object already being rolled up ...
    };
  }

}

module.exports = AgendaController;
