const Agenda = require('agenda');
const MongooseConnectionConfig = require('mongoose-connection-config');
const logger = require('winster').instance();

let self = null;
let instance = null;

class AgendaWrapper {

  constructor() {
    self = this;

    this.logger = logger;
    this.mongoUri = new MongooseConnectionConfig(require('./../../config/mongoose-config')).getMongoUri();
    this.agenda = new Agenda({
      db: {
        address: this.mongoUri,
        collection: 'jobs-service~~agenda',
        options: {useNewUrlParser: true}
      }
    });

    this.agenda.on('start', job => {
      self.logger.info(`Job starting: ${job.attrs.name}`);
      // A logger.trace('--attrs:', job.attrs);
    });

    this.agenda.on('complete', job => {
      console.log('--');
      console.info(`Job finished: ${job.attrs.name}`);
      console.log(`Job: ${job}`);
    });

    this.agenda.on('success:echo something', job => {
      console.info(`Successfully echoed: ${job.attrs.data}`);
    });

    this.agenda.on('fail:echo something', (err, job) => {
      console.info(`Job '${job.name}' failed with error: ${err.message}`);
    });

    process.on('SIGTERM', this._graceful);
    process.on('SIGINT', this._graceful);
    process.on('SIGUSR2', this._graceful); // Nodemon's signal for restart.

  }

  static async instance() {
    if (!instance) {
      instance = new AgendaWrapper();
      await instance.start();
    }
    return instance;
  }

  async start() {

    await this.agenda.start();
    this._defineAgendas();
    await this._defineJobs();
  }

  _defineAgendas() {
    this.agenda.define('echo something', (job, done) => {
      console.log('agenda: ', job.name);
      done();
    });
  }

  async _defineJobs() {
    await this.agenda.every('minute', 'echo something');
    console.log('done defining jobs');
  }

  /**
   * Gracefully shutdown agenda.
   *
   * @returns {Promise<void>}
   * @private
   */
  async _graceful() {
    console.info('gracefully shutting down agenda ...');
    try {
      if (this.agenda) {
        await this.agenda.stop();
      }
    } catch (e) {
      console.error('Cloud not gracefully shutdown agenda', e);
    }
    process.exit(0);
  }

  async stop() {
    await this._graceful();
  }
}

module.exports = AgendaWrapper;
