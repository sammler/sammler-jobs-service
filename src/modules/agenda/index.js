const Agenda = require('agenda');
const MongooseConnectionConfig = require('mongoose-connection-config');
const logger = require('winster').instance();
const glob = require('glob');
const path = require('path');

let instance = null;

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
      logger.trace(`[agendaWrapper] Job starting: ${job.attrs.name}`);
      logger.trace('[agendaWrapper:attrs]', job.attrs);
    });

    this.agenda.on('complete', job => {
      logger.trace('[agendaWrapper] --');
      logger.trace(`[agendaWrapper] Job finished: ${job.attrs.name}`);
      // Logger.trace(`[agendaWrapper] Job: ${job}`);
    });

    this.agenda.on('success:echo something', job => {
      logger.trace(`[agendaWrapper] Successfully echoed: ${job.attrs.data}`);
    });

    this.agenda.on('fail:echo something', (err, job) => {
      logger.trace(`[agendaWrapper] Job '${job.name}' failed with error: ${err.message}`);
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
    await this._defineJobs();
  }

  /**
   * Define the job definitions for agenda.
   *
   * @private
   */
  _defineAgendas() {

    console.log('');
    logger.trace('------ ++ Agenda.JobDefinitions');
    let jobDefinitions = glob.sync(path.join(__dirname, './processors/**/*.processor.js'));
    jobDefinitions.forEach(item => {
      let JobDefinition = require(item);
      let jobDefinition = new JobDefinition();
      logger.trace(`[agenda._defineAgendas] Created job-definition with name: "${jobDefinition.name}"`);
      this.agenda.define(jobDefinition.name, (job, done) => {
        jobDefinition.run(job, done);
      });
    });
    logger.trace('------ // Agenda.JobDefinitions');
    console.log('');
  }

  /**
   * Define jobs.
   * @private
   */
  async _defineJobs() {
    await this.agenda.every('minute', 'echo');
    await this.agenda.every('minute', 'nats', {nats: {foo: 'bar'}});
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
    } catch (e) {
      logger.trace.error('[agendaWrapper] Could not gracefully shutdown agenda', e);
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
