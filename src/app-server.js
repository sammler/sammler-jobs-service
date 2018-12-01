const express = require('express');
const _ = require('lodash');
const initializer = require('express-initializers');
const path = require('path');
const mongoose = require('mongoose');

const MongooseConnectionConfig = require('mongoose-connection-config');
const AgendaWrapper = require('./modules/agenda');
const natsClient = require('./nats-client').instance();

class AppServer {

  constructor(config) {

    this.config = _.extend(_.clone(config), config || {});

    this.server = null;
    this.agendaWrapper = null;
    this.logger = require('winster').instance();

    this.app = express();

  }

  async start() {
    const MongoUri = new MongooseConnectionConfig(require('./config/mongoose-config')).getMongoUri();

    await initializer(this.app, {directory: path.join(__dirname, 'initializers')});

    try {
      await mongoose.connect(MongoUri, {useNewUrlParser: true});
      this.logger.trace(`Successfully connected to mongo`);
    } catch (err) {
      this.logger.error(`Could not connect to mongo`, err);
    }

    try {
      await natsClient.connect();
    } catch (err) {
      this.logger.error(`[stan] Cannot connect to stan: ${err}`);
    }

    try {
      this.server = await this.app.listen(this.config.PORT);
      this.logger.info(`[app-server] Express server listening on port ${this.config.PORT} in "${this.config.NODE_ENV}" mode`);
    } catch (err) {
      this.logger.error('[app-server] Cannot start express server', err);
    }

    try {
      this.agendaWrapper = new AgendaWrapper();
      await this.agendaWrapper.start();

    } catch (e) {
      this.logger.trace('[app-server] Could not start Agenda', e);
    }
  }

  async stop() {

    try {
      await this.agendaWrapper.stop();
    } catch (e) {
      this.logger.error(`[agenda] Cannot stop agenda ... ${e}`);
    }

    try {
      await natsClient.disconnect();
    } catch (err) {
      this.logger.error(`[stan] Cannot disconnect from stan ... ${err}`);
    }

    if (mongoose.connection) {
      try {
        await mongoose.connection.close(); // Using Moongoose >5.0.4 connection.close is preferred over mongoose.disconnect();
        mongoose.models = {};
        mongoose.modelSchemas = {};
        this.logger.trace('[app-server] Closed mongoose connection');
      } catch (e) {
        this.logger.error('[app-server] Could not close mongoose connection', e);
      }
    } else {
      this.logger.trace('[app-server] No mongoose connection to close');
    }

    if (this.server) {
      try {
        await this.server.close();
        this.logger.info('[app-server] Server closed');
      } catch (e) {
        this.logger.error('[app-server] Could not close server', e);
      }
    } else {
      this.logger.trace('[app-server] No server to close');
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
