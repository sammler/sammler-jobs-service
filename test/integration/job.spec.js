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
        expect(res.body).to.have.a.property('_id').to.not.be.empty;
      });
  });

  it('POST `/job` creates a new job and allows passing the Id', () => {
    const doc = {
      _id: 'bla',
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
        expect(res.body).to.have.a.property('_id').to.be.equal(doc._id);
      });

  });

  it('POST `/job` creates a new job with default status', () => {
    const doc = {
      name: 'foo',
      details: {
        foo: 'bar',
        bar: 'baz'
      }
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
        expect(res.body).to.have.a.property('details').to.deep.equal(doc.details);
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
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('POST `/job` throws an error if parent is not existing', () => {
    const doc = {
      name: 'foo',
      parentId: 'xx'
    };
    return server
      .post('/v1/job')
      .send(doc)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('DELETE `/job/:id` removes a job', () => {
    const doc = {
      name: 'foo'
    };
    return server
      .post('/v1/job')
      .send(doc)
      .then(result => {
        return server
          .delete(`/v1/job/${result.body._id}`)
          .expect(HttpStatus.OK);
      });
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
