const NatsStreaming = require('node-nats-streaming');
const logger = require('winster').instance();

const config = require('./config/server-config');

let stan = null;

class NatsStream {

  constructor() {
    this.cluster = 'test-cluster';
    this.clientId = `jobs-service_${process.pid}`;
    this.server = config.NATS_STREAMING_SERVER;
  }

  static instance() {
    if (!stan) {
      stan = new NatsStream();
    }
    return stan;
  }

  connect() {
    logger.trace(`[nats-client] Connect to cluster: ${this.cluster}, clientId: ${this.clientId}, server: ${this.server}`);
    return new Promise((resolve, reject) => {
      stan = NatsStreaming.connect(this.cluster, this.clientId, this.server);

      stan.on('connect', () => {
        resolve();
      });

      stan.on('error', err => {
        reject(err);
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {

      stan.close();

      stan.on('close', () => {
        resolve();
      });

      stan.on('error', err => {
        reject(err);
      });
    });
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      stan.publish(channel, JSON.stringify(message), (err, guid) => {
        if (err) {
          logger.error('Publishing failed', err);
          reject(new Error('Publish failed: ' + err));
        } else {
          logger.trace('Message published: ' + guid);
          resolve('Message published: ' + guid);
        }
      });
    });
  }
}

module.exports = NatsStream;
