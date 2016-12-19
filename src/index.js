const AppServer = require('./app-server');

const config = {
  port: process.env.PORT || 3003
};

const appServer = new AppServer(config);
appServer.start();

// process.on ('SIGINT', () => {
//   console.log('\nreceived sigint\n');
//   appServer.stop();
// });
//
// process.on ('SIGTERM', () => {
//   console.log('\nreceived sigterm\n');
//   appServer.stop();
// });
