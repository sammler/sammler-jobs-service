const Agenda = require('agenda');
const MongooseConnectionConfig = require('mongoose-connection-config');
const glob = require('glob');
const path = require('path');
const logger = require('winster').instance();

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
      logger.trace(`[AgendaWrapper:on:start] Job starting: ${job.attrs.name}`);
      logger.trace('[AgendaWrapper:on:start:job.attrs.data]', job.attrs.data);
    });

    this.agenda.on('complete', job => {
      logger.trace(`[AgendaWrapper:on:complete] Job finished: '${job.attrs.name} - ${job.attrs.data.job_identifier}'`);
    });

    this.agenda.on('success', job => {
      logger.trace(`[AgendaWrapper:on:success] Successfully echoed: ${job.attrs.data.job_identifier}`);
    });

    this.agenda.on('fail', (err, job) => {
      logger.trace(`[AgendaWrapper:on:fail] Job '${job.name}' failed with error: ${err.message}`);
    });

    process.on('SIGTERM', this._graceful);
    process.on('SIGINT', this._graceful);
    process.on('SIGUSR2', this._graceful); // Nodemon's signal for restart.

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
      logger.trace(`[agenda._defineAgendas] Created job-definition with name: "${jobDefinition.name}"`);
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
        logger.trace('[agendaWrapper] Gracefully shutting down agenda ...');
        await this.agenda.stop();
      }
    } catch (err) {
      logger.error('[agendaWrapper] Could not gracefully shutdown agenda', err);
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
