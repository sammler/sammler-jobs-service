const superTest = require('supertest-as-promised');
const HttpStatus = require('http-status-codes');
const AppServer = require('./../../src/api/app-server');
const JobsBL = require('./../../src/api/modules/jobs/jobs.bl');

const defaultConfig = require('./../test-lib/default-config');

describe('INTEGRATION => JOB', () => {
  let server;
  const appServer = new AppServer(defaultConfig);

  before(() => {
    return appServer.start()
      .then(() => {
        server = superTest(appServer.server);
      });
  });

  beforeEach(() => {
    return JobsBL.removeAll();
  });

  after(() => {
    return appServer.stop();
  });

  xit('DELETE `/job/:id` returns an error if there are children', () => {

  });

  xit('PATCH `/job` properly patches the jobs properties', () => {
    // const doc = {
    //   name: 'foo',
    //   status: 'bar'
    // };
    //
    // return server
    //   .post('/v1/job')
    //   .send(doc)
    //   .then(result => {
    //     expect(result.body).to.have.a.property('_id');
    //     let id = result.body._id;
    //   });

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

  xit('updates the status of a job ', () => {
    expect(false).to.be.true;
  });

  xit('updates the status of a child-job', () => {
    expect(false).to.be.true;
  });
});
