const superTest = require('supertest');
const HttpStatus = require('http-status-codes');
const AppServer = require('../../src/app-server');
const JobsBL = require('../../src/modules/jobs/jobs.bl');

const defaultConfig = require('../test-lib/default-config');

xdescribe('[integration] => GET /jobs/{status} => returns the {status} jobs', () => {

  let server;
  let appServer;

  const testFixtures = [
    {
      status: 'running',
      expected: 1
    },
    {
      status: 'idle',
      expected: 2
    },
    {
      status: 'aborted',
      expected: 3
    },
    {
      status: 'timeout',
      expected: 4
    },
    {
      status: 'completed',
      expected: 5
    }
  ];

  after(() => {
    return appServer.stop();
  });

  before(() => {

    const jobsToAdd = require('./fixtures/jobs.json');
    return appServer.start()
      .then(() => {
        server = superTest(appServer.server);
      })
      .then(() => {
        return JobsBL.removeAll();
      })
      .then(() => {
        return server
          .post('/v1/jobs')
          .send(jobsToAdd)
          .expect(HttpStatus.CREATED)
          .then(result => {
            expect(result).to.exist;
          });
      });
  });

  it('has now jobs', () => {
    return server
      .get('/v1/jobs')
      .expect(HttpStatus.OK)
      .then(result => {
        expect(result.body).to.exist;
        expect(result.body).to.be.an('array');
        expect(result.body).to.be.of.length(15);
      });
  });

  testFixtures.forEach(item => {
    it(`status ${item.status}`, () => {
      return server
        .get(`/v1/jobs/${item.status}`)
        .expect(HttpStatus.OK)
        .then(result => {
          expect(result.body).to.be.an('array');
          expect(result.body).to.have.length(item.expected);
        });
    });
  });

});
