const superTest = require('supertest');
const HttpStatus = require('http-status-codes');
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
  });

  afterEach(async () => {
    testLib.sleep(1000);
    await AgendaController.removeAll();
    testLib.sleep(1000);
    await appServer.stop();
  });

  describe('General', () => {
    it('we should have zero jobs, everything is cleaned when running the tests', async () => {
      let count = await AgendaController.count();
      expect(count).to.be.equal(0);
    });
  });

  describe('POST /v1/jobs', () => {
    it('creates a new job and returns values', async () => {

      const job = {
        tenant_id: 'foo',
        user_id: 'foo',
        processor: 'nats.publish',
        subject: 'nats - do whatever',
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
          expect(result.body).to.have.a.property('subject', job.subject);
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

    it('throws an error if `user_id`, `tenant_id`, `processor`, `subject` or `repeatPattern` is not provided', async () => {

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
          expect(result.body.validationErrors).to.be.an('array').to.contain(`Argument 'processor' cannot be null or empty.`);
          expect(result.body.validationErrors).to.be.an('array').to.contain(`Argument 'subject' cannot be null or empty.`);
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

      // Setup
      let tokenUser1 = {
        tenant_id: 'bar1',
        user_id: 'foo1'
      };
      let tokenUser2 = {
        tenant_id: 'bar2',
        user_id: 'foo2'
      };

      // First save some jobs for
      // - user1
      // - user2
      for (let i = 0; i < 3; i++) {

        const job = {
          tenant_id: tokenUser1.tenant_id,
          user_id: tokenUser1.user_id,
          processor: 'nats.publish',
          subject: `nats - do whatever ${i}`,
          repeatPattern: '* * * * *',
          nats: {
            foo: 'bar',
            bar: 'baz'
          }
        };

        // eslint-disable-next-line no-await-in-loop
        await server
          .post('/v1/jobs')
          .set('x-access-token', testLib.getToken(tokenUser1))
          .send(job)
          .expect(HttpStatus.CREATED);
      }

      for (let i = 0; i < 4; i++) {
        const job = {
          tenant_id: tokenUser2.tenant_id,
          user_id: tokenUser2.user_id,
          processor: 'nats.publish',
          subject: `nats - do whatever ${i}`,
          repeatPattern: '* * * * *',
          nats: {
            foo: 'bar',
            bar: 'baz'
          }
        };

        // eslint-disable-next-line no-await-in-loop
        await server
          .post('/v1/jobs')
          .set('x-access-token', testLib.getToken(tokenUser1))
          .send(job)
          .expect(HttpStatus.CREATED);
      }

      // Then fetch only the jobs for user2 (3 jobs)
      await server
        .get('/v1/jobs')
        .set('x-access-token', testLib.getToken(tokenUser2))
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

  describe('DELETE /v1/jobs', () => {

    it('deletes a job for the currently authenticated user');

    it('throws `Unauthorized` if there is no valid user', async () => {
      await server
        .delete('/v1/jobs')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

});
