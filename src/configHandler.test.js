const test = require('ava');
const sinon = require('sinon');
const fs = require('fs');

const configHandler = require('./configHandler');

const testConfig = `
tvheadend_url: http://admin:test@192.168.0.1:9981
antennas_url: http://127.0.0.1:5004
tuner_count: 6 # numbers of tuners in tvheadend
device_uuid: 2f70c0d7-90a3-4429-8275-cbeeee9cd605
`.trim();

let sandbox;
let fsStub;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
  fsStub = sandbox.stub(fs);
});

test.afterEach.always(() => {
  sandbox.restore();
});

test.serial('loads the specified config', (t) => {
  fsStub.existsSync.returns(true);
  fs.readFileSync.returns(testConfig);
  const results = configHandler.loadConfig('test.yml');

  t.is(results.tvheadend_parsed_uri, 'http://192.168.0.1:9981');
  t.is(results.tvheadend_username, 'admin');
  t.is(results.tvheadend_password, 'test');
  t.is(results.tvheadend_url, 'http://admin:test@192.168.0.1:9981');
  t.is(results.tvheadend_stream_url, 'http://admin:test@192.168.0.1:9981');
  t.is(results.tvheadend_stream_username, 'admin');
  t.is(results.tvheadend_stream_password, 'test');
  t.is(results.antennas_url, 'http://127.0.0.1:5004');
  t.is(results.tuner_count, 6);
  t.is(results.device_uuid, '2f70c0d7-90a3-4429-8275-cbeeee9cd605');

  t.assert(fsStub.existsSync.calledWith('test.yml'));
  t.assert(fsStub.existsSync.calledOnce);

  t.assert(fsStub.readFileSync.calledWith('test.yml', 'utf8'));
  t.assert(fsStub.readFileSync.calledOnce);
});

test.serial('load the config from the default path', (t) => {
  fsStub.existsSync.returns(true);
  fs.readFileSync.returns(testConfig);
  const results = configHandler.loadConfig();

  t.is(results.tvheadend_parsed_uri, 'http://192.168.0.1:9981');
  t.is(results.tvheadend_username, 'admin');
  t.is(results.tvheadend_password, 'test');
  t.is(results.tvheadend_url, 'http://admin:test@192.168.0.1:9981');
  t.is(results.tvheadend_stream_url, 'http://admin:test@192.168.0.1:9981');
  t.is(results.tvheadend_stream_username, 'admin');
  t.is(results.tvheadend_stream_password, 'test');
  t.is(results.antennas_url, 'http://127.0.0.1:5004');
  t.is(results.tuner_count, 6);
  t.is(results.device_uuid, '2f70c0d7-90a3-4429-8275-cbeeee9cd605');

  t.assert(fsStub.existsSync.calledWith('config/config.yml'));
  t.assert(fsStub.existsSync.calledOnce);

  t.assert(fsStub.readFileSync.calledWith('config/config.yml', 'utf8'));
  t.assert(fsStub.readFileSync.calledOnce);
});

test.serial('quits if it cannot find the file', (t) => {
  sandbox.stub(console);
  const processStub = sandbox.stub(process);
  fsStub.existsSync.returns(false);

  const results = configHandler.loadConfig();
  t.assert(processStub.exit.calledWith(1));
  t.assert(processStub.exit.calledOnce);
});

test.serial('load the config from env variables entirely', (t) => {
  const envStub = sandbox.stub(process, 'env');

  envStub.value({
    NODE_ENV: 'test',
    TVHEADEND_URL: 'https://envuser:envpass@tvheadend.test',
    ANTENNAS_URL: 'https://antennas.test',
    TUNER_COUNT: '10',
    DEVICE_UUID: '1234-4567',
  });

  const results = configHandler.loadConfig();
  t.is(results.tvheadend_parsed_uri, 'https://tvheadend.test');
  t.is(results.tvheadend_username, 'envuser');
  t.is(results.tvheadend_password, 'envpass');
  t.is(results.tvheadend_url, 'https://envuser:envpass@tvheadend.test');
  t.is(results.tvheadend_stream_url, 'https://envuser:envpass@tvheadend.test');
  t.is(results.tvheadend_stream_username, 'envuser');
  t.is(results.tvheadend_stream_password, 'envpass');
  t.is(results.antennas_url, 'https://antennas.test');
  t.is(results.tuner_count, 10);
  t.is(results.device_uuid, '1234-4567');
});

test.serial('load the config from a mix of env var and file', (t) => {
  fsStub.existsSync.returns(true);
  fs.readFileSync.returns(testConfig);

  const envStub = sandbox.stub(process, 'env');
  envStub.value({
    NODE_ENV: 'test',
    TVHEADEND_URL: 'https://envuser:envpass@tvheadend.test',
    TVHEADEND_STREAM_URL: 'https://streamuser:streampass@tvheadendstream.test',
  });
  const results = configHandler.loadConfig('test.yml');

  t.is(results.tvheadend_parsed_uri, 'https://tvheadend.test');
  t.is(results.tvheadend_username, 'envuser');
  t.is(results.tvheadend_password, 'envpass');
  t.is(results.tvheadend_url, 'https://envuser:envpass@tvheadend.test');
  t.is(results.tvheadend_stream_url, 'https://streamuser:streampass@tvheadendstream.test');
  t.is(results.tvheadend_stream_username, 'streamuser');
  t.is(results.tvheadend_stream_password, 'streampass');
  t.is(results.antennas_url, 'http://127.0.0.1:5004');
  t.is(results.tuner_count, 6);
  t.is(results.device_uuid, '2f70c0d7-90a3-4429-8275-cbeeee9cd605');

  t.assert(fsStub.existsSync.calledWith('test.yml'));
  t.assert(fsStub.existsSync.calledOnce);

  t.assert(fsStub.readFileSync.calledWith('test.yml', 'utf8'));
  t.assert(fsStub.readFileSync.calledOnce);
});

test('structureConfig formats the results', (t) => {
  const results = configHandler.structureConfig(
    'https://user:pass@tvheadend.test',
    'https://streamUser:streamPass@tvheadendStream.test',
    'https://antennas.test',
    2,
    '123456789',
  );

  t.is(results.tvheadend_parsed_uri, 'https://tvheadend.test');
  t.is(results.tvheadend_username, 'user');
  t.is(results.tvheadend_password, 'pass');
  t.is(results.tvheadend_url, 'https://user:pass@tvheadend.test');
  t.is(results.tvheadend_stream_url, 'https://streamUser:streamPass@tvheadendStream.test');
  t.is(results.tvheadend_parsed_stream_uri, 'https://tvheadendStream.test');
  t.is(results.tvheadend_stream_username, 'streamUser');
  t.is(results.tvheadend_stream_password, 'streamPass');
  t.is(results.antennas_url, 'https://antennas.test');
  t.is(results.tuner_count, 2);
  t.is(results.device_uuid, '123456789');
});

test.serial('parseTvheadendURI splits a URI with a username and pass correctly', (t) => {
  // For some reason this needs to be serial or else it crashes
  const results = configHandler.parseTvheadendURI('https://user:pass@testing.test');

  t.is(results.username, 'user');
  t.is(results.password, 'pass');
  t.is(results.uri, 'https://testing.test');
});

test.serial('parseTvheadendURI splits a URI with no username and pass correctly', (t) => {
  // For some reason this needs to be serial or else it crashes
  const results = configHandler.parseTvheadendURI('https://testme.test');

  t.falsy(results.username);
  t.falsy(results.passwords);
  t.is(results.uri, 'https://testme.test');
});
