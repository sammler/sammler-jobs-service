const AppServer = require('./../../src/app-server');

describe('app-server.js', () => {
  let appServer;
  before(() => {
    appServer = new AppServer();
  });

  it('contains the required methods', () => {
    expect(appServer).to.have.a.property('start');
    expect(appServer).to.have.a.property('stop');
  });



});
