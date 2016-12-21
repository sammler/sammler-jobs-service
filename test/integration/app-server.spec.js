const AppServer = require('./../../src/app-server');

describe('INTEGRATION => app-server', () => {
  let appServer = null;
  const defaultConfig = {
    port: 3003
  };
  beforeEach(() => {
    appServer = new AppServer(defaultConfig);
    return appServer.start();
  });
  afterEach(() => {
    return appServer.stop();
  });

  xit('exposes the open-api spec', () => {
    expect(false).to.be.true;
  });
});
