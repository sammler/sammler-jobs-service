const superTest = require('supertest-as-promised');
const AppServer = require('./../../src/app-server');

const defaultConfig = require('./../test-lib/default-config');

describe('INTEGRATION => JOBS', () => {
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
      .get('/v1/jobs')
      .expect(200)
      .then(result => {
        expect(result).to.exist;
        expect(result).to.be.an.array;
      });
  });

  xit('returns running jobs', () => {
    expect(true).to.be.true;
  });
  xit('returns idle jobs', () => {
    expect(true).to.be.true;
  });

  xit('return aborted jobs', () => {
    expect(true).to.be.true;
  });
  xit('returns timeout jobs', () => {
    expect(true).to.be.true;
  });

  xit('returns finished jobs', () => {
    expect(true).to.be.true;
  });
});
