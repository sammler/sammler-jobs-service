const AppServer = require('./src/app-server');
const serverConfig = require('./src/config/server-config');

const server = new AppServer(serverConfig);
server.start();
