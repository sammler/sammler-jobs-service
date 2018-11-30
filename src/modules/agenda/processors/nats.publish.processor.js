// eslint-disable quotes
const logger = require('winster').instance();
const Stan = require('node-nats-streaming');
const config = require('./../../../config/server-config');

class ProcessorNats {
  constructor() {
    this.name = 'nats.publish';
    this.clusterId = 'test-cluster';
    this.clientId = `jobs-service-${process.pid}`;
    this.server = config.NATS_STREAMING_SERVER;
  }

  run(job, done) {
    logger.trace(`[agenda.processor.nats]`);

    let stan = Stan.connect(this.clusterId, this.clientId, this.server);

    stan.on('connect', () => {
      logger.trace(`[agenda.processor.nats] We are connected`);

      logger.trace(`[agenda.processor.nats] Publishing with: ${job.attrs.data.nats}`);
      stan.publish('subject', JSON.stringify(job.attrs.data.nats || {}), function (err, guid) {
        if (err) {
          logger.error(`[agenda.processor.nats] Publish failed: "${err}"`);
        } else {
          logger.trace(`[agenda.processor.nats] Publish succeeded with Guid ${guid}`);
        }
        stan.close();
        logger.trace(`[agenda.processor.nats] We are disconnected`);
        done();
      });
    });

  }
}

module.exports = ProcessorNats;
