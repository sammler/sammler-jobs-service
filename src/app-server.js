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
    const MongoUri = new MongooseConnectionConfig(require('./config/mongoose-config')).getMongoUri();
    await initializer(this.app, {directory: path.join(__dirname, 'initializers')});
    await mongoose.connect(MongoUri, {useNewUrlParser: true});

    try {
      this.server = await this.app.listen(this.config.PORT);
      this.logger.info(`Express server listening on port ${this.config.PORT} in "${this.config.NODE_ENV}" mode`);
    } catch (err) {
      this.logger.error('Cannot start express server', err);
    }

    try {
      this.agendaWrapper = new AgendaWrapper();
      await this.agendaWrapper.start();

    } catch (e) {
      this.logger.trace('Could not start Agenda', e);
    }

    const signals = {
      SIGINT: 2,
      SIGTERM: 15
    };

    function shutdown(signal, value) {
      this.server.close(function () {
        console.log('server stopped by ' + signal);
        process.exit(128 + value);
      });
    }

    Object.keys(signals).forEach(function (signal) {
      process.on(signal, function () {
        shutdown(signal, signals[signal]);
      });
    });

    process.on('SIGTERM', this.graceful);
    process.on('SIGINT', this.graceful);
    process.on('SIGUSR2', this.graceful); // Nodemon
    process.once('SIGUSR2', this.graceful); // Nodemon
  }

  graceful() {
    console.log('graceful');
  }

  async stop() {

    this.logger.trace('OK, we are stopping the server ...');

    // Await this.agendaWrapper.stop();

    if (mongoose.connection) {
      try {
        await mongoose.connection.close(); // Using Moongoose >5.0.4 connection.close is preferred over mongoose.disconnect();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        this.logger.trace('Closed mongoose connection');
      } catch (e) {
        this.logger.trace('Could not close mongoose connection', e);
      }
    } else {
      this.logger.trace('No mongoose connection to close');
    }

    if (this.server) {
      try {
        await this.server.close();
        this.logger.trace('Server closed');
      } catch (e) {
        this.logger.trace('Could not close server', e);
      }
    } else {
      this.logger.trace('No server to close');
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
  // }

}

module.exports = AppServer;
