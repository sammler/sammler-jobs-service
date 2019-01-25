const superTest = require('supertest');
const HttpStatus = require('http-status-codes');
const AppServer = require('../../src/app-server');

// Const defaultConfig = require('../test-lib/default-config');

describe('[integration] => /health-check', () => {

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

  it('returns a timestamp', () => {
    return server
      .get('/health-check')
      .expect(HttpStatus.OK)
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.a.property('body');
        expect(res.body).to.have.a.property('ts');
      });
  });


});
