const superTest = require('supertest-as-promised');
const HttpStatus = require('http-status-codes');
const AppServer = require('./../../src/api/app-server');

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

  it('POST `/jobs` creates multiple jobs', () => {
    const docs = [
      {
        name: 'foo',
        status: 'running'
      },
      {
        name: 'bar',
        status: 'running'
      }
    ];

    return server
      .post('/v1/jobs')
      .send(docs)
      .expect(HttpStatus.CREATED)
      .then(result => {
        expect(result.body).to.exist;
        expect(result.body).to.be.an.array;
        expect(result.body).to.be.of.length(2);
        expect(result.body[0]).to.have.a.property('_id').to.exist;
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
