const logger = require('winster').instance();

class ProcessorEcho {

  constructor() {
    this.name = 'echo';
  }

  run(job, done) {
    logger.trace(`[agenda.processor.echo] ${job}`);
    done();
  }
}

module.exports = ProcessorEcho;
