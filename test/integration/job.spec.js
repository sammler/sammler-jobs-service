const superTest = require('supertest-as-promised');
const HttpStatus = require('http-status-codes');
const AppServer = require('./../../src/app-server');
const JobsBL = require('./../../src/modules/jobs/jobs.bl');

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

  it('POST `/job` creates a new job', ( ) => {
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

