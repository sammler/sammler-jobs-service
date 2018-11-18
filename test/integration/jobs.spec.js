const superTest = require('supertest');
const HttpStatus = require('http-status-codes');
const AppServer = require('../../src/app-server');
const JobsModel = require('../../src/modules/jobs/jobs.model').Model;

const defaultConfig = require('../test-lib/default-config');

describe('[integration] => jobs', () => {

  let server;
  let appServer;

  beforeEach(async () => {
    appServer = new AppServer();
    await appServer.start();
    server = superTest(appServer.server);
  });

  afterEach(async () => {
    await JobsModel.deleteMany();
    await appServer.stop();
  });

  xit('POST `/v1/jobs` creates a single job', () => {
    const doc = {
      name: 'foo',
      status: 'running'
    };

    // Todo: Cannot work as it even works without having the endpoint available ...
    return server
      .post('/v1/jobs')
      .send(doc)
      .expect(HttpStatus.CREATED)
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.a.property('body');
        expect(res.body).to.have.a.property('_id').to.not.be.empty;
      });
  });

  xit('POST `/jobs` creates multiple jobs', () => {
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
        expect(result.body).to.be.an('array');
        expect(result.body).to.be.of.length(2);
        expect(result.body[0]).to.have.a.property('_id').to.exist;
      })
      .catch(err => {
        expect(err).to.not.exist;
      });
  });

  xit('POST `/jobs` creates a new job and allows passing the Id', () => {

    const doc = {
      _id: 'bla',
      name: 'foo',
      status: 'running'
    };

    return server
      .post('/v1/jobs')
      .send(doc)
      .expect(HttpStatus.CREATED)
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.a.property('body');
        expect(res.body).to.have.a.property('_id').to.be.equal(doc._id);
      })
      .catch(err => {
        console.error(err);
      });

  });

  xit('POST `/job` creates a new job with default status', () => {
    const doc = {
      name: 'foo',
      details: {
        foo: 'bar',
        bar: 'baz'
      }
    };

    return server
      .post('/v1/jobs')
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

  xit('POST `/job` throws an error in case of an unknown status', () => {
    const doc = {
      name: 'foo',
      status: 'bar'
    };

    return server
      .post('/v1/jobs')
      .send(doc)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  xit('POST `/jobs` throws an error if required params are missing', () => {
    const doc = {};

    return server
      .post('/v1/jobs')
      .send(doc)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR)
      .then(result => {
        // Todo: Something we should take care of, the error should probably be in result.body?
        expect(result.text).to.contain('ValidationError');
      });
  });

  xit('POST `/jobs` throws an error if parent is not existing', () => {
    const doc = {
      name: 'foo',
      parentId: 'xx'
    };
    return server
      .post('/v1/jobs')
      .send(doc)
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  xit('PATCH `/jobs/:id` => patches the job', () => {
    const doc = {
      name: 'foo',
      status: 'idle'
    };
    return server
      .post('/v1/jobs')
      .send(doc)
      .expect(HttpStatus.CREATED)
      .then(result => {
        expect(result.body._id).to.exist;
        return Promise.resolve(result.body._id);
      })
      .then(id => {
        return server
          .patch(`/v1/jobs/${id}`)
          .send({status: 'running'})
          .expect(HttpStatus.OK)
          .then(() => {
            return Promise.resolve(id);
          });
      })
      .then(id => {
        return server
          .get(`/v1/jobs/${id}`)
          .then(result => {
            return expect(result.body).to.have.a.property('status').to.be.equal('running');
          });
      });
  });

  xit('POST `/jobs/:id/children` adds children', () => {

    const doc = {
      name: 'parent'
    };
    const child = {
      name: 'child'
    };

    return server
      .post('/v1/jobs')
      .send(doc)
      .expect(HttpStatus.CREATED)
      .then(result => {
        expect(result.body).to.have.a.property('_id').to.exist;
        return Promise.resolve(result.body._id);
      })
      .then(parentId => {
        return server
          .post(`/v1/jobs/${parentId}/children`)
          .send(child)
          .expect(HttpStatus.CREATED)
          .then(result => {
            expect(result.body).to.have.a.property('parentId').to.be.equal(parentId);
            expect(result.body).to.have.a.property('path').to.contain(parentId);
            expect(result.body).to.have.a.property('_w').to.be.equal(0);
          });
      });

  });

  xit('PUT `/jobs/:id` updates a job', () => {
    expect(true).to.be.false;
  });

  xit('DELETE `/jobs/:id` removes a job', () => {

    const doc = {
      name: 'foo'
    };

    return server
      .post('/v1/jobs')
      .send(doc)
      .then(result => {
        return server
          .delete(`/v1/jobs/${result.body._id}`)
          .expect(HttpStatus.OK);
      });
  });

  xit('DELETE `/jobs/:id` returns an error if there are children', () => {
    expect(true).to.be.false;
  });

  xit('GET `jobs`=> returns all jobs', () => {
    return server
      .get('/v1/jobs')
      .expect(HttpStatus.OK)
      .then(result => {
        expect(result).to.exist;
        expect(result.body).to.exist;
        expect(result.body).to.be.an('array');
      });
  });

  xit('GET `/jobs/:id` returns a single job', () => {
    const newJob = {
      _id: 'newId',
      name: 'My new job'
    };
    return server
      .post('/v1/jobs')
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

  xit('PATCH /jobs/:id/status updates the status', () => {
    const docs = {
      name: 'foo'
    };
    return server
      .post('/v1/jobs')
      .send(docs)
      .expect(HttpStatus.CREATED)
      .then(result => {
        return Promise.resolve(result.body._id);
      })
      .then(id => {
        expect(id).to.exist;
        const newStatus = {
          status: 'running'
        };
        return server
          .patch(`/v1/jobs/${id}/status`)
          .send(newStatus)
          .expect(HttpStatus.OK)
          .then(result => {
            expect(result.body).to.exist;
            expect(result.body).to.have.a.property('nModified').to.be.equal(1);
          });
      });
  });

  xit('PATCH /jobs/:id/status throws an error with an invalid new status', () => {
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
          .expect(HttpStatus.INTERNAL_SERVER_ERROR)
          .then(result => {
            expect(result.body).to.exist;
            expect(result.body).to.have.a.property('name').to.be.equal('ValidationError');
          });
      });
  });

  xit('creates sub-jobs', () => {
    expect(false).to.be.true;
  });

  xit('updates the status of a child-job', () => {
    expect(false).to.be.true;
  });

});

