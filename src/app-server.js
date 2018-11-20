const express = require('express');
const _ = require('lodash');
const MongooseConnectionConfig = require('mongoose-connection-config');
const initializer = require('express-initializers');
const path = require('path');
const mongoose = require('mongoose');
const AgendaWrapper = require('./modules/agenda');

const defaultConfig = require('./config/server-config');

class AppServer {

  constructor(config) {

    this.config = _.extend(_.clone(defaultConfig), config || {});

    this.server = null;
    this.agendaWrapper = null;
    this.logger = require('winster').instance();

    this.app = express();

  }

  async start() {
    const mongoUri = new MongooseConnectionConfig(require('./config/mongoose-config')).getMongoUri();
    await initializer(this.app, {directory: path.join(__dirname, 'initializers')});
    await mongoose.connect(mongoUri, {useNewUrlParser: true});
    this.agendaWrapper = new AgendaWrapper();
    await this.agendaWrapper.start();

    try {
      this.server = await this.app.listen(this.config.PORT);
      this.logger.info(`Express server listening on port ${this.config.PORT} in "${this.config.NODE_ENV}" mode`);
    } catch (err) {
      this.logger.error('Cannot start express server', err);
    }
  }

  async stop() {
    if (mongoose.connection) {
      try {
        await mongoose.connection.close(); // Using Moongoose >5.0.4 connection.close is preferred over mongoose.disconnect();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        this.logger.trace('Closed mongoose connection');
      } catch (e) {
        this.logger.trace('Could not close mongoose connection', e);
      }
    }
    if (this.server) {
      try {
        await this.server.close();
        this.logger.trace('Server closed');
      } catch (e) {
        this.logger.trace('Could not close server', e);
      }
    }
  }

  // _initApp() {
  //   this.app = express();
  //
  //   this.app.settings.env = process.env; // Todo: something is wrong here.
  //
  //   // this.app.get('/*', (req, res, next) => {
  //   //   console.log(`${req.path}\n`);
  //   //   next();
  //   // });
  //   routeConfig.init(this.app); // Todo: See auth-service for a better way of doing that
  // }

  // _validateConfig() {
  //   const validationErrors = [];
  //   if (!this.config.PORT) {
  //     validationErrors.push('No PORT defined.');
  //   }
  //
  //   return validationErrors;
  // }

  // start() {
  //   const valErrors = this._validateConfig();
  //   if (valErrors && valErrors.length) {
  //     throw new Error('Validation errors when validation the configuration', valErrors, this.config);
  //   }
  //
  //   return new Promise((resolve, reject) => {
  //     mongooseConnection.connect()
  //       .then(connection => {
  //         this.app.db = connection;
  //         this.server = this.app.listen(this.config.PORT, err => {
  //           if (err) {
  //             this.logger.error('Cannot start express server', err);
  //             return reject(err);
  //           }
  //           this.logger.debug(`Express server listening on port ${this.config.PORT} in "${process.env.NODE_ENV}" mode`);
  //           return resolve();
  //         });
  //       })
  //       .catch(err => {
  //         this.logger.fatal('Error creating a mongoose connection', err);
  //         throw err;
  //       });
  //   });
  // }

}

module.exports = AppServer;
