const test = require('ava');
const sinon = require('sinon');
const axios = require('axios');

const tvheadendApi = require('./tvheadendApi');

let sandbox;
let axiosStub;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
  axiosStub = sandbox.stub(axios, 'get');
});

test.afterEach.always(() => {
  sandbox.restore();
});

test.serial('returns the right options with auth', (t) => {
  const mockConfig = {
    tvheadendUrl: 'https://test.test',
    tvheadendUsername: 'foo',
    tvheadendPassword: 'bar',
  };

  tvheadendApi.get('/testPath', mockConfig);
  t.assert(axiosStub.calledWith('https://test.test/testPath', {
    responseType: 'json',
    timeout: 1500,
    auth: {
      username: 'foo',
      password: 'bar',
    },
  }));
  t.assert(axiosStub.calledOnce);
});

test.serial('returns the right options with no auth', (t) => {
  const mockConfig = {
    tvheadendUrl: 'https://test.test',
  };

  tvheadendApi.get('/testPath', mockConfig);
  t.assert(axiosStub.calledWith('https://test.test/testPath', {
    responseType: 'json',
    timeout: 1500,
  }));
  t.assert(axiosStub.calledOnce);
});
