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
      .expect(HttpStatus.OK)
      .then(result => {
        expect(result).to.exist;
        expect(result).to.be.an.array;
      });
  });

  it('GET `/jobs/:id` returns a single job', () => {
    const newJob = {
      _id: 'newId',
      name: 'My new job'
    };
    return server
      .post('/v1/job')
      .send(newJob)
      .expect(HttpStatus.CREATED)
      .then(result => {
        expect(result.body._id).to.be.equal(newJob._id);
        return server
          .get(`/v1/jobs/${newJob._id}/`)
          .expect(HttpStatus.OK)
          .then(result2 => {
            expect(result2).to.exist;
            expect(result2.body).to.exist;
            expect(result2.body).to.have.a.property('name').to.be.equal(newJob.name);
          });
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

  it('PATCh /jobs/:id/status updates the status', () => {
    const docs = [{
      name: 'foo'
    }];
    return server
      .post('/v1/jobs')
      .send(docs)
      .expect(HttpStatus.CREATED)
      .then(result => {
        const jobId = result.body[0]._id;
        console.log(jobId);
        expect(jobId).to.exist;
        return server
          .patch(`/v1/jobs/${jobId}/status`)
          .send({status: 'running'})
          .expect(HttpStatus.OK)
          .then(result => {
            expect(result).to.exist;
            expect(result.body).to.exist;
            console.log(result.body);
            expect(result.body).to.have.a.property('ok').to.be.equal(1);
            expect(result.body).to.have.a.property('nModified').to.be.equal(1);
            return server
              .get(`/v1/jobs/${jobId}`)
              .then(result => {
                console.log('result', result.body);
                expect(result.body).to.have.a.property('status').to.be.equal('running');
              });
          });
      });
  });

  it('PATCh /jobs/:id/status throws an error with an invalid new status', () => {
    const docs = [{
      name: 'foo'
    }];
    return server
      .post('/v1/jobs')
      .send(docs)
      .then(result => {
        const jobId = result.body[0]._id;
        return server
          .patch(`/v1/jobs/${jobId}/status`)
          .send({status: 'foo'})
          .expect(HttpStatus.INTERNAL_SERVER_ERROR);
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
