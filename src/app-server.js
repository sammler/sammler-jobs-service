const express = require('express');
const _ = require('lodash');
const initializer = require('express-initializers');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('winster').instance();
const MongooseConnectionConfig = require('mongoose-connection-config');

const AgendaWrapper = require('./modules/agenda');
const natsClient = require('./nats-client').instance();

class AppServer {

  constructor(config) {

    this.config = _.extend(_.clone(config), config || {});
    this.server = null;
    this.agendaWrapper = null;
    this.app = express();

  }

  async start() {
    const MongoUri = new MongooseConnectionConfig(require('./config/mongoose-config')).getMongoUri();

    await initializer(this.app, {directory: path.join(__dirname, 'initializers')});

    try {
      await mongoose.connect(MongoUri, {useNewUrlParser: true});
      logger.info(`[app-server] Successfully connected to mongo`);
    } catch (err) {
      logger.fatal(`[app-server] Could not connect to mongo`, err);
      throw err;
    }

    try {
      await natsClient.connect();
    } catch (err) {
      logger.fatal(`[app-server] Cannot connect to stan: ${err}`);
      throw err;
    }

    try {
      this.server = await this.app.listen(this.config.PORT);
      logger.info(`[app-server] Express server listening on port ${this.config.PORT} in "${this.config.NODE_ENV}" mode`);
    } catch (err) {
      logger.fatal('[app-server] Cannot start express server', err);
      throw err;
    }

    try {
      this.agendaWrapper = new AgendaWrapper();
      await this.agendaWrapper.start();

    } catch (err) {
      logger.fatal('[app-server] Could not start Agenda', err);
      throw err;
    }
  }

  async stop() {

    try {
      await this.agendaWrapper.stop();
    } catch (err) {
      logger.error(`[agenda] Cannot stop agenda ... ${err}`);
      throw err;
    }

    try {
      await natsClient.disconnect();
    } catch (err) {
      logger.error(`[stan] Cannot disconnect from stan ... ${err}`);
      throw err;
    }

    if (mongoose.connection) {
      try {
        await mongoose.connection.close(); // Using Moongoose >5.0.4 connection.close is preferred over mongoose.disconnect();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        logger.info('[app-server] Closed mongoose connection');
      } catch (err) {
        logger.error('[app-server] Could not close mongoose connection', err);
        throw err;
      }
    } else {
      logger.trace('[app-server] No mongoose connection to close');
    }

    if (this.server) {
      try {
        await this.server.close();
        logger.info('[app-server] Server closed');
      } catch (err) {
        logger.error('[app-server] Could not close server', err);
        throw err;
      }
    } else {
      logger.trace('[app-server] No server to close');
    }
  }

  // Todo(AAA): Check what we need from here, then just get rid of it ...
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
