const test = require('ava');
const tvheadendApi = require('./tvheadendApi');

test('returns the right options with auth', t => {
  const mockConfig = {
    tvheadend_parsed_uri: 'https://test.test',
    tvheadend_username: 'foo',
    tvheadend_password: 'bar',
  }

  const results = tvheadendApi.get('/testPath', mockConfig);
  t.is(results.url, 'https://test.test/testPath');
  t.is(results.method, 'GET');
  t.is(results.responseType, 'json');
  t.is(results.timeout, 1500);
  t.is(results.auth.username, 'foo');
  t.is(results.auth.password, 'bar');
});

test('returns the right options with no auth', t => {
  const mockConfig = {
    tvheadend_parsed_uri: 'https://test.test',
  }

  const results = tvheadendApi.get('/testPath', mockConfig);
  t.is(results.url, 'https://test.test/testPath');
  t.is(results.method, 'GET');
  t.is(results.responseType, 'json');
  t.is(results.timeout, 1500);
  t.falsy(results.auth);
});