const Winston = require('winston');

let logger = null;

if (process.env.NODE_ENV === 'test') {
  logger = new (Winston.Logger)({
    transports: [
      new (Winston.transports.File)({filename: 'test-errors.log'})
    ]
  });
} else {
  logger = new Winston.Logger({
    transports: [
      new Winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  });

}

module.exports = logger;
