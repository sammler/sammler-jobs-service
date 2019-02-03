const Agenda = require('agenda');
const MongooseConnectionConfig = require('mongoose-connection-config');
const glob = require('glob');
const path = require('path');
const logger = require('winster').instance();

const JobsHistoryModel = require('./../jobs-history/jobs-history.model').Model;

let instance = null;

// Todo (AAA): This is a big mess, especially in terms of logging ...
class AgendaWrapper {

  constructor() {
    this.mongoUri = new MongooseConnectionConfig(require('./../../config/mongoose-config')).getMongoUri();
    this.agenda = new Agenda({
      db: {
        address: this.mongoUri,
        collection: 'jobs-service~~agenda',
        options: {useNewUrlParser: true}
      }
    });

    this.agenda.on('start', job => {
      logger.trace('');
      logger.trace('--- ++');
      logger.trace(`[AgendaWrapper:on:start] Job starting: ${job.attrs.name} - ${job.attrs.data.job_identifier}`);
      logger.trace('[AgendaWrapper:on:start:job.attrs.data]', job.attrs.data);
      logger.trace('--- //');
      logger.trace('');
    });

    this.agenda.on('success', async job => {
      logger.trace(`[AgendaWrapper:on:success] '${job.attrs.name} - ${job.attrs.data.job_identifier}'`);
      // await AgendaWrapper._saveJobHistory(job, true);
    });

    this.agenda.on('fail', async (err, job) => {
      logger.trace(`[AgendaWrapper:on:fail] '${job.attrs.name} - ${job.attrs.data.job_identifier}' failed with error: ${err.message}`);
      // await AgendaWrapper._saveJobHistory(job, false, err);

    });
    this.agenda.on('complete', async job => {
      logger.trace(`[AgendaWrapper:on:complete] Completed: '${job.attrs.name} - ${job.attrs.data.job_identifier}'`);
      // logger.trace(`[AgendaWrapper:on:complete:job]:`, job);
    });

    process.on('SIGTERM', this._graceful);
    process.on('SIGINT', this._graceful);
    process.on('SIGUSR2', this._graceful); // Nodemon's signal for restart.
  }

  static async _saveJobHistory(job, hasSucceeded, error) {

    let result = {
      job_id: job.attrs._id,
      tenant_id: job.attrs.data.tenant_id,
      user_id: job.attrs.data.user_id,
      processor: job.attrs.data.processor,
      job_identifier: job.attrs.data.job_identifier,
      succeeded: hasSucceeded,
      failed_error: error || {}, // Todo: fetch the right value
      executed_at: Date.now(),
      data: {} // Todo: fetch the right value
    };
    let model = new JobsHistoryModel(result);
    await model.save();
  }

  /**
   * Get an instance of the AgendaWrapper.
   */
  static async instance() {
    if (!instance) {
      instance = new AgendaWrapper();
      await instance.start();
    }
    return instance;
  }

  /**
   * Start agenda.
   *
   * @async
   */
  async start() {

    await this.agenda.start();
    this._defineAgendas();
  }

  /**
   * Define the job definitions for agenda.
   *
   * @private
   */
  _defineAgendas() {

    logger.trace('');
    logger.trace('[AgendaWrapper] ------ ++ Agenda.JobDefinitions');
    let jobDefinitions = glob.sync(path.join(__dirname, './processors/**/*.processor.js'));
    jobDefinitions.forEach(item => {
      let JobDefinition = require(item);
      let jobDefinition = new JobDefinition();
      logger.trace(`[AgendaWrapper] Created job-definition with name: "${jobDefinition.name}"`);
      this.agenda.define(jobDefinition.name, (job, done) => {
        jobDefinition.run(job, done);
      });
    });
    logger.trace('[AgendaWrapper] ------ // Agenda.JobDefinitions');
    logger.trace('');
  }

  /**
   * Gracefully shutdown agenda.
   *
   * @private
   */
  async _graceful() {
    try {
      if (this.agenda) {
        logger.trace('[AgendaWrapper] Gracefully shutting down agenda ...');
        await this.agenda.stop();
      }
    } catch (err) {
      logger.error('[AgendaWrapper] Could not gracefully shutdown agenda', err);
      throw err;
    }
    // Don't exit the entire process here!!!
    // process.exit(0);
  }

  /**
   * Stop agenda.
   */
  async stop() {
    await this._graceful();
  }
}

module.exports = AgendaWrapper;
