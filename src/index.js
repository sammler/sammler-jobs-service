const AppServer = require('./app-server');
const serverConfig = require('./config/server-config');

const signals = {
  SIGINT: 2,
  SIGTERM: 15
};

Object.keys(signals).forEach(function (signal) {
  console.log('Signal', signal);
  process.on(signal, function () {
    console.log('Signal received');
  });
});

let server;
(async () => {
  server = new AppServer(serverConfig);
  await server.start();
})();

