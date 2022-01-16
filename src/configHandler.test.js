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

test.serial('loads the specified config', t => {
  fsStub.existsSync.returns(true);
  fs.readFileSync.returns(testConfig);
  const results = configHandler.loadConfig('test.yml');

  t.is(results.tvheadend_parsed_uri, 'http://192.168.0.1:9981');
  t.is(results.tvheadend_stream_username, 'admin');
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

test.serial('load the config from the default path', t => {
  fsStub.existsSync.returns(true);
  fs.readFileSync.returns(testConfig);
  const results = configHandler.loadConfig();

  t.is(results.tvheadend_parsed_uri, 'http://192.168.0.1:9981');
  t.is(results.tvheadend_stream_username, 'admin');
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

test.serial('quits if it cannot find the file', t => {
  sandbox.stub(console);
  let processStub = sandbox.stub(process);
  fsStub.existsSync.returns(false);
  
  const results = configHandler.loadConfig();
  t.assert(processStub.exit.calledWith(1));
  t.assert(processStub.exit.calledOnce);
});

test.serial('load the config from env variables entirely', t => {
  let envStub = sandbox.stub(process, 'env');
  let structureConfigSpy = sandbox.spy(configHandler.structureConfig);
  
  envStub.value({
    NODE_ENV: 'test',
    TVHEADEND_URL: 'https://envuser:envpass@tvheadend.test',
    ANTENNAS_URL: 'https://antennas.test',
    TUNER_COUNT: '10',
    DEVICE_UUID: '1234-4567'
  })

  const results = configHandler.loadConfig();
  t.is(results.tvheadend_parsed_uri, 'https://tvheadend.test');
  t.is(results.tvheadend_stream_username, 'envuser');
  t.is(results.tvheadend_password, 'envpass');
  t.is(results.tvheadend_url, 'https://envuser:envpass@tvheadend.test');
  t.is(results.tvheadend_stream_url, 'https://envuser:envpass@tvheadend.test');
  t.is(results.tvheadend_stream_username, 'envuser');
  t.is(results.tvheadend_stream_password, 'envpass');
  t.is(results.antennas_url, 'https://antennas.test');
  t.is(results.tuner_count, 10);
  t.is(results.device_uuid, '1234-4567');
});

test.todo('load the config from a mix of env var and file');

test.todo('test structureConfig')

test.todo('test parseTvheadendURI')
