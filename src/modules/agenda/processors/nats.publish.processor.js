const logger = require('winster').instance();

const natsClient = require('../../../nats-client').instance();

class ProcessorNats {
  constructor() {
    this.name = 'nats.publish';
  }

  run(job, done) {
    logger.trace(`[agenda.processor.nats] Publishing with: ${job.attrs.data.nats || `jobs.attrs.data.nats not defined for job '${job.attrs.name} // ${job.attrs.data.subject || '<no-subject>'}'`}`);
    natsClient.publish('subject', JSON.stringify(job.attrs.data.nats || {}), function (err, guid) {
      if (err) {
        logger.error(`[agenda.processor.nats] Publish failed: "${err}"`);
      } else {
        logger.trace(`[agenda.processor.nats] Publish succeeded with Guid: ${guid}`);
      }
      done();
    });
  }
}

module.exports = ProcessorNats;
