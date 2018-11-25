const express = require('express');
const glob = require('glob');
const logger = require('winster').instance();
const path = require('path');

const router = express.Router(); // eslint-disable-line new-cap

// Load routes based on the pattern './../modules/**/*.routes.js
let routes = glob.sync(path.join(__dirname, './../modules/**/*.routes.js'));

console.log('');
logger.trace('------ ++ Routes');
routes.forEach(r => {
  logger.trace('Registering route', r);
  router.use('/', require(r));
});
logger.trace('----- // Routes');
console.log('');

module.exports = {
  configure: app => {
    app.use(router);
  }
};
