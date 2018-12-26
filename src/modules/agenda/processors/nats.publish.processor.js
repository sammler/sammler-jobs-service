const logger = require('winster').instance();

const natsClient = require('../../../nats-client').instance();

class ProcessorNats {
  constructor() {
    this.name = 'nats.publish';
  }

  run(job, done) {
    logger.trace(`[agenda.processor.nats.publish] Publishing with: ${job.attrs.data.nats || `jobs.attrs.data.nats not defined for job '${job.attrs.name} // ${job.attrs.data.subject || '<no-subject>'}'`}`);

    let natsChannel = job.attrs.data.nats.channel;
    let natsData = job.attrs.data.nats.data;

    // Add the `publishedAt` timestamp
    natsData.publishedAt = Date.now();

    natsClient.publish(natsChannel, JSON.stringify(natsData || {}), function (err, guid) {
      if (err) {
        logger.error(`[agenda.processor.nats.publish] Publish failed: `, err);
      } else {
        logger.trace(`[agenda.processor.nats.publish] Publish succeeded with Guid: ${guid}`);
      }
      done();
    });
  }
}

module.exports = ProcessorNats;
