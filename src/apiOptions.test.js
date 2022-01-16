const test = require('ava');
const apiOptions = require('./apiOptions');

test('returns the right options with auth', t => {
  const mockConfig = {
    tvheadend_parsed_uri: 'https://test.test',
    tvheadend_username: 'foo',
    tvheadend_password: 'bar',
  }

  const results = apiOptions.get('/testPath', mockConfig);
  t.is(results.url, 'https://test.test/testPath');
  t.is(results.method, 'GET');
  t.is(results.json, true);
  t.is(results.timeout, 1500);
  t.is(results.auth.user, 'foo');
  t.is(results.auth.pass, 'bar');
  t.is(results.auth.sendImmediately, false);
});

test('returns the right options with no auth', t => {
  const mockConfig = {
    tvheadend_parsed_uri: 'https://test.test',
  }

  const results = apiOptions.get('/testPath', mockConfig);
  t.is(results.url, 'https://test.test/testPath');
  t.is(results.method, 'GET');
  t.is(results.json, true);
  t.is(results.timeout, 1500);
  t.falsy(results.auth);
});