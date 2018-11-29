const AppServer = require('../../src/app-server');

const defaultConfig = {
  port: 3002
};

describe('UNIT => app-server.js', () => {
  it('contains the required methods', () => {
    const appServer = new AppServer(defaultConfig);
    expect(appServer).to.have.a.property('start');
    expect(appServer).to.have.a.property('stop');
  });

  xit('can initialize without config', () => {
    const appServer = new AppServer();
    expect(appServer).to.exist;
    expect(appServer).to.have.a.property('config').to.be.deep.equal({});
  });

  xit('_validateConfig returns validation errors', () => {
    const appServer = new AppServer();
    const v = appServer._validateConfig({});
    expect(v).to.exist;
    expect(v).to.be.of.length(1);
    expect(v).to.contain('No port defined.');
  });
});
