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

  it('test', () => {
    expect(true).to.be.true;
  });
});
