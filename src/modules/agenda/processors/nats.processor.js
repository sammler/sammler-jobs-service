// eslint-disable quotes
const logger = require('winster').instance();
const Stan = require('node-nats-streaming');
const config = require('./../../../config/server-config');

class ProcessorNats {
  constructor() {
    this.name = 'nats';
    this.clusterId = 'test-cluster';
    this.clientId = `jobs-service-${process.pid}`;
    this.server = config.NATS_STREAMING_SERVER;
  }

  run(job, done) {
    logger.trace(`[nats.processor]`);

    let stan = Stan.connect(this.clusterId, this.clientId, this.server);

    stan.on('connect', () => {
      logger.trace(`[nats.processor] We are connected`);

      stan.publish('subject', JSON.stringify(job.attrs.nats || {}), function (err, guid) {
        if (err) {
          logger.error(`[nats.processor] Publish failed: "${err}"`);
        } else {
          logger.error(`[nats.processor] Publish succeeded with Guid ${guid}`);
        }
      });
      stan.close();
      logger.trace(`[nats.processor] We are disconnected`);
      done();
    });

  }
}

module.exports = ProcessorNats;
