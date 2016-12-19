const Winston = require('winston');

const logger = new Winston.Logger({
  transports: [
    new Winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
