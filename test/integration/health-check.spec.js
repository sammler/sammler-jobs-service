const supertest = require('supertest-as-promised');
const AppServer = require('./../../src/app-server');

const defaultConfig = require('./../test-lib/default-config');

describe('GET `health-check`', () => {
  let server;
  const appServer = new AppServer(defaultConfig);
  beforeEach(() => {
    return appServer.start()
      .then(() => {
        server = supertest(appServer.server);
      });
  });

  afterEach(() => {
    return appServer.stop();
  });

  it('returns a timestamp', () => {
    return server
      .get('/health-check')
      .expect(200)
      .then((res) => {
        expect(res).to.exist;
        expect(res).to.have.a.property('body');
        expect(res.body).to.have.a.property('ts');
      });
  });
});
