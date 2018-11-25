const logger = require('winster').instance();

class ProcessorEcho {

  constructor() {
    this.name = 'echo';
  }

  run(job, done) {
    logger.trace(`[agenda:echo] ${job}`);
    done();
  }
}

module.exports = ProcessorEcho;
