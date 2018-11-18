const superTest = require('supertest');
const HttpStatus = require('http-status-codes');
const AppServer = require('../../src/app-server');

describe('[integration] => /api-docs/', () => {

  let server;
  let appServer;

  beforeEach(async () => {
    appServer = new AppServer();
    await appServer.start();
    server = superTest(appServer.server);
  });

  afterEach(async () => {
    await appServer.stop();
  });

  it('GET /api-docs => returns redirection to /api-docs/', () => {
    return server
      .get('/api-docs')
      .expect(HttpStatus.MOVED_PERMANENTLY);
  });

  it('GET /api-docs/ => returns the api-docs', () => {
    return server
      .get('/api-docs/')
      .expect(HttpStatus.OK);
  });
});
