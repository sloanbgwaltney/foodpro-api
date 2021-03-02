const app = require('../../src/app');

describe('\'user-password\' service', () => {
  it('registered the service', () => {
    const service = app.service('password');
    expect(service).toBeTruthy();
  });
});
