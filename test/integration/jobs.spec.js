const superTest = require('supertest-as-promised');
const AppServer = require('./../../src/app-server');

const defaultConfig = require('./../test-lib/default-config');

describe.only('INTEGRATION => jobs', () => {

  let server;
  const appServer = new AppServer(defaultConfig);
  before(() => {
    return appServer.start()
      .then(() => {
        server = superTest(appServer.server);
      });
  });

  after(() => {
    return appServer.stop();
  });

  it('GET `jobs`=> returns all jobs', () => {
    return server
      .get('/jobs')
      .expect(200);
  });

  xit('returns running jobs', () => {
    expect(true).to.be.true;
  });

  xit('return aborted jobs', () => {
    expect(true).to.be.true;
  });

});
