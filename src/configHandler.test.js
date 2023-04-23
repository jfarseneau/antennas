const test = require('ava');
const sinon = require('sinon');
const fs = require('fs');

const configHandler = require('./configHandler');

const testConfig = `
tvheadend_url: http://admin:test@192.168.0.1:9981
antennas_url: http://127.0.0.1:5004
tuner_count: 6 # numbers of tuners in tvheadend
deviceUuid: 2f70c0d7-90a3-4429-8275-cbeeee9cd605
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

  t.is(results.tvheadendUrl, 'http://192.168.0.1:9981');
  t.is(results.tvheadendUsername, 'admin');
  t.is(results.tvheadendPassword, 'test');
  t.is(results.tvheadendStreamUrl, 'http://192.168.0.1:9981');
  t.is(results.tvheadendStreamUsername, 'admin');
  t.is(results.tvheadendStreamPassword, 'test');
  t.is(results.antennasUrl, 'http://127.0.0.1:5004');
  t.is(results.tunerCount, 6);
  t.is(results.deviceUuid, '2f70c0d7-90a3-4429-8275-cbeeee9cd605');

  t.assert(fsStub.existsSync.calledWith('test.yml'));
  t.assert(fsStub.existsSync.calledOnce);

  t.assert(fsStub.readFileSync.calledWith('test.yml', 'utf8'));
  t.assert(fsStub.readFileSync.calledOnce);
});

test.serial('load the config from the default path', (t) => {
  fsStub.existsSync.returns(true);
  fs.readFileSync.returns(testConfig);
  const results = configHandler.loadConfig();

  t.is(results.tvheadendUrl, 'http://192.168.0.1:9981');
  t.is(results.tvheadendUsername, 'admin');
  t.is(results.tvheadendPassword, 'test');
  t.is(results.tvheadendStreamUrl, 'http://192.168.0.1:9981');
  t.is(results.tvheadendStreamUsername, 'admin');
  t.is(results.tvheadendStreamPassword, 'test');
  t.is(results.antennasUrl, 'http://127.0.0.1:5004');
  t.is(results.tunerCount, 6);
  t.is(results.deviceUuid, '2f70c0d7-90a3-4429-8275-cbeeee9cd605');

  t.assert(fsStub.existsSync.calledWith('config/config.yml'));
  t.assert(fsStub.existsSync.calledOnce);

  t.assert(fsStub.readFileSync.calledWith('config/config.yml', 'utf8'));
  t.assert(fsStub.readFileSync.calledOnce);
});

test.serial('load the config from env variables entirely', (t) => {
  const envStub = sandbox.stub(process, 'env');

  envStub.value({
    NODE_ENV: 'test',
    TVHEADEND_URL: 'https://envuser:envpass@tvheadend.test',
    ANTENNAS_URL: 'https://antennas.test',
    TUNER_COUNT: '10',
    DEVICE_UUID: '1234-4567',
    DEVICE_NAME: 'Foo',
    DEVICE_MANUFACTURER: 'ACME Corp',
    DEVICE_MANUFACTURER_URL: 'https://acme.test',
    DEVICE_MODEL_NUMBER: '1234',
    DEVICE_FIRMWARE_NAME: 'test_firmware',
    DEVICE_FIRMWARE_VERSION: '1.0.0',
    DEVICE_AUTH: 'test_auth',
  });

  const results = configHandler.loadConfig();
  t.is(results.tvheadendUrl, 'https://tvheadend.test');
  t.is(results.tvheadendUsername, 'envuser');
  t.is(results.tvheadendPassword, 'envpass');
  t.is(results.tvheadendStreamUrl, 'https://tvheadend.test');
  t.is(results.tvheadendStreamUsername, 'envuser');
  t.is(results.tvheadendStreamPassword, 'envpass');
  t.is(results.antennasUrl, 'https://antennas.test');
  t.is(results.tunerCount, 10);
  t.is(results.deviceUuid, '1234-4567');
  t.is(results.deviceName, 'Foo');
  t.is(results.deviceManufacturer, 'ACME Corp');
  t.is(results.deviceManufacturerUrl, 'https://acme.test');
  t.is(results.deviceModelNumber, '1234');
  t.is(results.deviceFirmwareName, 'test_firmware');
  t.is(results.deviceFirmwareVersion, '1.0.0');
  t.is(results.deviceAuth, 'test_auth');
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

  t.is(results.tvheadendUrl, 'https://tvheadend.test');
  t.is(results.tvheadendUsername, 'envuser');
  t.is(results.tvheadendPassword, 'envpass');
  t.is(results.tvheadendStreamUrl, 'https://tvheadendstream.test');
  t.is(results.tvheadendStreamUsername, 'streamuser');
  t.is(results.tvheadendStreamPassword, 'streampass');
  t.is(results.antennasUrl, 'http://127.0.0.1:5004');
  t.is(results.tunerCount, 6);
  t.is(results.deviceUuid, '2f70c0d7-90a3-4429-8275-cbeeee9cd605');
  t.is(results.deviceName, 'Virtual Antennas');
  t.is(results.deviceManufacturer, 'github.com/jfarseneau');
  t.is(results.deviceManufacturerUrl, 'https://github.com/jfarseneau/antennas');
  t.is(results.deviceModelNumber, 'R2D2');

  t.assert(fsStub.existsSync.calledWith('test.yml'));
  t.assert(fsStub.existsSync.calledOnce);

  t.assert(fsStub.readFileSync.calledWith('test.yml', 'utf8'));
  t.assert(fsStub.readFileSync.calledOnce);
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
