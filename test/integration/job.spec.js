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

  it('POST `/job` creates a new job', () => {
    const doc = {
      name: 'foo',
      status: 'running'
    };

    return server
      .post('/v1/job')
      .send(doc)
      .expect(HttpStatus.CREATED)
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.a.property('body');
        expect(res.body).to.have.a.property('_id');
      });
  });

  it('POST `/job` creates a new job with default status', () => {
    const doc = {
      name: 'foo'
    };

    return server
      .post('/v1/job')
      .send(doc)
      .expect(HttpStatus.CREATED)
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.a.property('body');
        expect(res.body).to.have.a.property('_id');
        expect(res.body).to.have.a.property('status').to.be.equal('idle');
      });
  });

  it('POST `/job` throws an error in case of an unknown status', () => {
    const doc = {
      name: 'foo',
      status: 'bar'
    };

    return server
      .post('/v1/job')
      .send(doc)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .then(res => {
        // Todo: Proper error handling here
      });
  });

  xit('considers the date-key for a job', () => {
    expect(true).to.be.false;
  });

  xit('updates jobs with the same date-key and _id', () => {
    expect(true).to.be.false;
  });

  xit('properly patches the jobs properties', () => {
    expect(true).to.be.false;
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
