const NatsStreaming = require('node-nats-streaming');
const logger = require('winster').instance();

const config = require('./config/server-config');

const CLIENT_ID_PREFIX = 'jobs-service';

class NatsStream {

  constructor() {
    this.cluster = 'test-cluster';
    this.clientId = `${CLIENT_ID_PREFIX}_${process.pid}`;
    this.server = config.NATS_STREAMING_SERVER;
    this.stan = null;
  }

  static instance() {
    if (!this.stan) {
      this.stan = new NatsStream();
    }
    return this.stan;
  }

  connect() {
    logger.trace(`[nats-client] Connect to cluster: ${this.cluster}, clientId: ${this.clientId}, server: ${this.server}`);
    return new Promise((resolve, reject) => {
      this.stan = NatsStreaming.connect(this.cluster, this.clientId, this.server);

      this.stan.on('connect', () => {
        resolve();
      });

      this.stan.on('error', err => {
        reject(err);
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {

      if (this.stan) {
        this.stan.close();
      }

      this.stan.on('close', () => {
        resolve();
      });

      this.stan.on('error', err => {
        reject(err);
      });
    });
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.stan.publish(channel, JSON.stringify(message), (err, guid) => {
        if (err) {
          logger.error('[nats-client] Publishing failed', err);
          reject(new Error('Publish failed: ' + err));
        } else {
          logger.trace('[nats-client] Message published: ' + guid);
          resolve('Message published: ' + guid);
        }
      });
    });
  }
}

module.exports = NatsStream;
