const bodyParser = require('body-parser');
const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const Context = require('./config/context');

const logger = require('./helper/logger');
const routeConfig = require('./route-config');

class AppServer {
  constructor(config) {
    this.config = config || {};

    this.server = null;
    this.logger = logger;
    this.context = Context.instance();
    this._initApp();
  }

  _initApp() {
    this.app = express();
    this.app.use(bodyParser.json());

    // this.app.get('/*', (req, res, next) => {
    //   console.log(`${req.path}\n`);
    //   next();
    // });
    routeConfig.init(this.app);
  }

  _validateConfig() {
    const validationErrors = [];
    if (!this.config.port) {
      validationErrors.push('No port defined.');
    }

    return validationErrors;
  }

  start() {
    const valErrors = this._validateConfig();
    if (valErrors && valErrors.length) {
      throw new Error('Validation errors when validation the configuration', valErrors, this.config);
    }

    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.config.port, err => {
        if (err) {
          this.logger.error('Cannot start express server', err);
          return reject(err);
        }
        this.logger.debug('Express server listening on port %d in "%s" mode', this.config.port, this.app.settings.env);
        return resolve();
      });
    });
  }

  stop() {
    return new Promise(resolve => {
      this.server.close(() => {
        // mongoose.disconnect();
        this.logger.debug('Server stopped');
        resolve();
      });
    });
  }

}

module.exports = AppServer;
