const superTest = require('supertest-as-promised');
const AppServer = require('./../../src/app-server');

const defaultConfig = require('./../test-lib/default-config');

describe.only('INTEGRATION => POST `job`', () => {
  let server;
  const appServer = new AppServer(defaultConfig);
  beforeEach(() => {
    return appServer.start()
      .then(() => {
        server = superTest(appServer.server);
      });
  });

  afterEach(() => {
    return appServer.stop();
  });

  it('creates a new job', () => {
    const doc = {
      name: 'foo',
      status: 'running'
    };

    return server
      .post('/job')
      .send(doc)
      .expect(200)
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.a.property('body');
        expect(res.body).to.have.a.property('_id');
      })
      .then(() => {
        return server
          .get('/jobs/count')
          .expect(200)
          .then(res => {
            expect(res).to.exist;
            expect(res.body).to.exist;
            expect(res.body).to.have.property('count').to.be.equal(1);
          });
      });
  });
});

