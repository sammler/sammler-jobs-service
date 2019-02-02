const superTest = require('supertest');
const HttpStatus = require('http-status-codes');
const mongoose = require('mongoose');

const AgendaController = require('./../../src/modules/agenda/agenda.controller');
const AppServer = require('../../src/app-server');
const testLib = require('./../test-lib');

describe('[integration] => agenda (jobs)', () => {

  let server;
  let appServer;

  beforeEach(async () => {
    appServer = new AppServer();
    await appServer.start();
    server = superTest(appServer.server);
    await AgendaController._removeAll();
  });

  afterEach(async () => {
    if (appServer) {
      await appServer.stop();
    }
  });

  describe('General', () => {
    it('we should have zero jobs, everything is cleaned when running the tests', async () => {
      let count = await AgendaController._count();
      expect(count).to.be.equal(0);
    });
  });

  describe('POST /v1/jobs', () => {
    it('creates a new job and returns values', async () => {

      const job = {
        tenant_id: 'foo',
        user_id: 'foo',
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *',
        nats: {
          foo: 'bar',
          bar: 'baz'
        }
      };

      const tokenPayLoad = {
        user_id: 'foo'
      };

      await server
        .post('/v1/jobs')
        .send(job)
        .set('x-access-token', testLib.getToken(tokenPayLoad))
        .expect(HttpStatus.CREATED)
        .then(result => {
          expect(result).to.exist;
          expect(result.body).to.exist;
          expect(result.body).to.have.a.property('job_id');
          expect(result.body).to.have.a.property('processor', job.processor);
          expect(result.body).to.have.a.property('user_id', job.user_id);
          expect(result.body).to.have.a.property('tenant_id', job.tenant_id);
          expect(result.body).to.have.a.property('job_identifier', job.job_identifier);
          expect(result.body).to.have.a.property('repeatPattern', job.repeatPattern);
          expect(result.body).to.have.a.property('data').to.have.a.property('nats').to.deep.equal(job.nats);
        });

    });

    it('throws an error if the user is not authenticated', async () => {
      await server
        .post('/v1/jobs')
        .send({})
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('throws an error if the user does not have the role `user`');

    it('updates a job for the given processor/subject/user_id');

    it('throws an error if `user_id`, `tenant_id`, `processor`, `job_identifier` or `repeatPattern` is not provided', async () => {

      const tokenPayLoad = {
        user_id: 'foo'
      };

      await server
        .post('/v1/jobs')
        .set('x-access-token', testLib.getToken(tokenPayLoad))
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .then(result => {
          expect(result.body).to.exist;
          expect(result.body).to.have.property('message').to.contain('Invalid input');
          expect(result.body.validationErrors).to.be.an('array').to.contain(`Argument 'user_id' cannot be null or empty.`);
          expect(result.body.validationErrors).to.be.an('array').to.contain(`Argument 'tenant_id' cannot be null or empty.`);
          expect(result.body.validationErrors).to.be.an('array').to.contain(`Argument 'job_identifier' cannot be null or empty.`);
          expect(result.body.validationErrors).to.be.an('array').to.contain(`Argument 'processor' cannot be null or empty.`);
          expect(result.body.validationErrors).to.be.an('array').to.contain(`Argument 'repeatPattern' cannot be null or empty.`);
        });

    });
  });

  describe('GET /v1/jobs', () => {

    it('returns the jobs for the currently authenticated user', async () => {

      const tokenPayLoad = {
        user_id: 'foo'
      };

      await server
        .get('/v1/jobs')
        .set('x-access-token', testLib.getToken(tokenPayLoad))
        .expect(HttpStatus.OK)
        .then(result => {
          expect(result.body).to.exist;
          expect(result.body).to.be.an('array');
        });

    });

    it('returns `Unauthorized` if there is no user', async () => {
      await server
        .get('/v1/jobs')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('returns only the jobs for the currently authenticated user', async () => {

      let user1 = testLib.getTokenPayload_User();
      let user2 = testLib.getTokenPayload_User();

      // First save some jobs for
      // - user1
      // - user2
      for (let i = 0; i < 3; i++) {

        const job = {
          tenant_id: user1.tenant_id,
          user_id: user1.user_id,
          processor: 'nats.publish',
          job_identifier: `nats - do whatever ${i}`,
          repeatPattern: '* * * * *',
          nats: {
            foo: 'bar',
            bar: 'baz'
          }
        };

        // eslint-disable-next-line no-await-in-loop
        await server
          .post('/v1/jobs')
          .set('x-access-token', testLib.getToken(user1))
          .send(job)
          .expect(HttpStatus.CREATED);
      }

      for (let i = 0; i < 4; i++) {
        const job = {
          tenant_id: user2.tenant_id,
          user_id: user2.user_id,
          processor: 'nats.publish',
          job_identifier: `nats - do whatever ${i}`,
          repeatPattern: '* * * * *',
          nats: {
            foo: 'bar',
            bar: 'baz'
          }
        };

        // eslint-disable-next-line no-await-in-loop
        await server
          .post('/v1/jobs')
          .set('x-access-token', testLib.getToken(user1))
          .send(job)
          .expect(HttpStatus.CREATED);
      }

      // Then fetch only the jobs for user2 (3 jobs)
      await server
        .get('/v1/jobs')
        .set('x-access-token', testLib.getToken(user2))
        .expect(HttpStatus.OK)
        .then(result => {
          expect(result.body).to.exist;
          expect(result.body).to.be.an('array').of.length(4);
        });

    });

    it('returns only jobs for authenticated users of role `user`');

    it('returns an empty array if there are no jobs', async () => {

      const tokenPayLoad = {
        user_id: 'foo'
      };

      await server
        .get('/v1/jobs')
        .set('x-access-token', testLib.getToken(tokenPayLoad))
        .expect(HttpStatus.OK)
        .then(result => {
          expect(result.body).to.exist;
          expect(result.body).to.be.an('array');
        });
    });
  });

  describe('GET /v1/jobs/count', () => {
    it('throws `Unauthorized` if there is no valid user', async () => {
      await server
        .delete('/v1/jobs/count')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('returns the count for the current user', async () => {
      const user1 = testLib.getTokenPayload_User();
      const user2 = testLib.getTokenPayload_User();

      const jobUser1 = {
        tenant_id: user1.tenant_id,
        user_id: user1.user_id,
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *'
      };

      const jobUser2 = {
        tenant_id: user2.tenant_id,
        user_id: user2.user_id,
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *'
      };

      await server
        .post('/v1/jobs')
        .send(jobUser1)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.CREATED);

      await server
        .post('/v1/jobs')
        .send(jobUser2)
        .set('x-access-token', testLib.getToken(user2))
        .expect(HttpStatus.CREATED);

      await server
        .get(`/v1/jobs/count`)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.OK)
        .then(result => {
          expect(result.body).to.have.a.property('count').to.be.equal(1);
        });
    });
  });

  describe('DELETE /v1/jobs', () => {

    it('throws `Unauthorized` if there is no valid user', async () => {
      await server
        .delete('/v1/jobs')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('deletes a job for the currently authenticated user', async () => {
      const user1 = testLib.getTokenPayload_User();
      const user2 = testLib.getTokenPayload_User();

      const jobUser1 = {
        tenant_id: user1.tenant_id,
        user_id: user1.user_id,
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *'
      };

      const jobUser2 = {
        tenant_id: user2.tenant_id,
        user_id: user2.user_id,
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *'
      };

      await server
        .post('/v1/jobs')
        .send(jobUser1)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.CREATED);

      await server
        .post('/v1/jobs')
        .send(jobUser2)
        .set('x-access-token', testLib.getToken(user2))
        .expect(HttpStatus.CREATED);

      await server
        .delete(`/v1/jobs`)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.OK);
      expect(await AgendaController._count()).to.be.equal(1);
    });

  });

  describe('DELETE /v1/jobs/all', () => {

    it('throws `Unauthorized` if there is no valid user', async () => {
      await server
        .delete('/v1/jobs/all')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('throws `Unauthorized` if the user is not assigned to role `system`', async () => {

      await server
        .delete('/v1/jobs/all')
        .set('x-access-token', testLib.getToken(testLib.getTokenPayload_User()))
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('deletes all jobs', async () => {

      const user1 = testLib.getTokenPayload_User();
      const user2 = testLib.getTokenPayload_User();
      const systemUser = testLib.getTokenPayload_User(undefined, undefined, [
        'system'
      ]);

      const jobUser1 = {
        tenant_id: user1.tenant_id,
        user_id: user1.user_id,
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *'
      };

      const jobUser2 = {
        tenant_id: user2.tenant_id,
        user_id: user2.user_id,
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *'
      };

      await server
        .post('/v1/jobs')
        .send(jobUser1)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.CREATED);

      await server
        .post('/v1/jobs')
        .send(jobUser2)
        .set('x-access-token', testLib.getToken(user2))
        .expect(HttpStatus.CREATED);
      expect(await AgendaController._count()).to.be.equal(2);

      await server
        .delete('/v1/jobs/all')
        .set('x-access-token', testLib.getToken(systemUser))
        .expect(HttpStatus.OK);

      expect(await AgendaController._count()).to.be.equal(0);

    });

  });

  describe('DELETE /v1/jobs/:id', () => {

    it('returns `unauthorized` if there is no current user', async () => {
      await server
        .delete('/v1/jobs/foo')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('returns `unauthorized` if the user does not own this job', async () => {

      const user1 = testLib.getTokenPayload_User();
      const user2 = testLib.getTokenPayload_User();

      const job = {
        tenant_id: user1.tenant_id,
        user_id: user1.user_id,
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *'
      };

      let job_id;

      // Post job as user1
      await server
        .post('/v1/jobs')
        .send(job)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.CREATED)
        .then(result => {
          expect(result.body).to.have.property('job_id').to.not.be.empty;
          job_id = result.body.job_id;
        });

      // Try to delete job as user2
      await server
        .delete(`/v1/jobs/${job_id}`)
        .set('x-access-token', testLib.getToken(user2))
        .expect(HttpStatus.UNAUTHORIZED)
        .then(result => {
          expect(result.body).to.contain('Current user is not allowed to perform this action.');
        });

    });

    it('deletes a given job', async () => {
      const job = {
        tenant_id: 'foo',
        user_id: 'foo',
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *',
        nats: {
          foo: 'bar',
          bar: 'baz'
        }
      };

      const user1 = {
        user_id: 'foo'
      };

      let job_id = null;

      // Post the job
      await server
        .post('/v1/jobs')
        .send(job)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.CREATED)
        .then(result => {
          expect(result.body).to.have.property('job_id');
          job_id = result.body.job_id;
        });

      // Delete it
      await server
        .delete(`/v1/jobs/${job_id}`)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.OK);
    });

  });

  describe('DELETE /v1/jobs/tenant/:tenant_id', async () => {
    it('returns `unauthorized` if there is no current user', async () => {
      await server
        .delete('/v1/jobs/tenant/foo')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('deletes all jobs by a tenant', async () => {

      const user1 = testLib.getTokenPayload_User();
      const user2 = testLib.getTokenPayload_User();

      const jobUser1 = {
        tenant_id: user1.tenant_id,
        user_id: user1.user_id,
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *'
      };

      const jobUser2 = {
        tenant_id: user2.tenant_id,
        user_id: user2.user_id,
        processor: 'nats.publish',
        job_identifier: 'nats - do whatever',
        repeatPattern: '* * * * *'
      };

      await server
        .post('/v1/jobs')
        .send(jobUser1)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.CREATED);
      expect(await AgendaController._count()).to.be.equal(1);

      await server
        .post('/v1/jobs')
        .send(jobUser2)
        .set('x-access-token', testLib.getToken(user2))
        .expect(HttpStatus.CREATED);
      expect(await AgendaController._count()).to.be.equal(2);

      await server
        .delete(`/v1/jobs/tenant/${user1.tenant_id}`)
        .set('x-access-token', testLib.getToken(user1))
        .expect(HttpStatus.OK);
      expect(await AgendaController._count()).to.be.equal(1);
    });
  });
});
