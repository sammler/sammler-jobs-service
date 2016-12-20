const superTest = require('supertest-as-promised');
const AppServer = require('./../../src/app-server');

const defaultConfig = require('./../test-lib/default-config');

describe.only('INTEGRATION => POST `job`', () => {
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

  xit('creates multiple jobs', () => {
    expect(false).to.be.true;
  });

  xit('removes a job', () => {
    expect(false).to.be.true;
  });

  xit('refuses creating a new job if required params are missing', () => {
    expect(false).to.be.true;
  });

  xit('updates an existing job', () => {
    expect(false).to.be.true;
  });

  xit('creates sub-jobs', () => {
    expect(false).to.be.true;
  });

});

