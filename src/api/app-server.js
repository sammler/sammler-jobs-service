const bodyParser = require('body-parser');
const express = require('express');
const bluebird = require('bluebird');
const helmet = require('helmet');
const cors = require('cors');
const expressLogger = require('morgan');
const MongooseConnection = require('mongoose-connection-promise');
const compression = require('compression');

const logger = require('winster').instance();
const routeConfig = require('./route-config');
const mongooseConfig = require('./config/mongoose-config');
const mongooseConnection = new MongooseConnection(mongooseConfig);

global.Promise = bluebird;

class AppServer {
  constructor(config) {
    this.config = config || {};

    this.server = null;
    this.logger = logger;
    this._initApp();
  }

  _initApp() {
    this.app = express();
    this.app.use(expressLogger('development'));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.set('json spaces', 2); // Todo: Forgot why are we doing that?
    // Todo: favicon

    this.app.settings.env = process.env; // Todo: something is wrong here.

    // this.app.get('/*', (req, res, next) => {
    //   console.log(`${req.path}\n`);
    //   next();
    // });
    routeConfig.init(this.app); // Todo: See auth-service for a better way of doing that
  }

  _validateConfig() {
    const validationErrors = [];
    if (!this.config.PORT) {
      validationErrors.push('No PORT defined.');
    }

    return validationErrors;
  }

  start() {
    const valErrors = this._validateConfig();
    if (valErrors && valErrors.length) {
      throw new Error('Validation errors when validation the configuration', valErrors, this.config);
    }

    return new Promise((resolve, reject) => {
      mongooseConnection.connect()
        .then(connection => {
          this.app.db = connection;
          this.server = this.app.listen(this.config.PORT, err => {
            if (err) {
              this.logger.error('Cannot start express server', err);
              return reject(err);
            }
            this.logger.debug(`Express server listening on port ${this.config.PORT} in "${this.app.settings.env.NODE_ENV}" mode`);
            return resolve();
          });
        })
        .catch(err => {
          this.logger.fatal('Error creating a mongoose connection', err);
          throw err;
        });
    });
  }

  stop() {
    return new Promise(resolve => {
      mongooseConnection.disconnect()
        .then(() => {

          if (this.server) {
            this.server.close(() => {
              this.logger.info('Server stopped');
              return resolve();
            });
          }
          return resolve();

        })
        .catch(err => {
          this.logger.error('Could not disconnect from MongoDB', err);
          throw err;
        });
    });
  }

}

module.exports = AppServer;
