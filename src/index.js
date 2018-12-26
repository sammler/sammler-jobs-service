const AppServer = require('./app-server');
const serverConfig = require('./config/server-config');
const logger = require('winster').instance();

const signals = {
  SIGINT: 2,
  SIGTERM: 15,
  SIGUSR2: 12 // nodemon
};
let server;

Object.keys(signals).forEach(function (signal) {
  process.on(signal, async () => {
    logger.trace(`[index.js] Got signal "${signal}", stopping the server ...`);
    await server.stop();
  });
});

(async () => {
  server = new AppServer(serverConfig);
  await server.start();
})();

