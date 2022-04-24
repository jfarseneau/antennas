const test = require('ava');
const sinon = require('sinon');

const lineup = require('./lineup');
const tvheadendApi = require('./tvheadendApi');

let sandbox;
let tvheadendApiStub;

test.beforeEach(() => {
  sandbox = sinon.createSandbox();
  tvheadendApiStub = sandbox.stub(tvheadendApi, 'get');
});

test.afterEach.always(() => {
  sandbox.restore();
});

test.serial('calls the API with the right options', async (t) => {
  const expectedResponse = {
    data: {
      entries: [{
        enabled: true,
        number: 1,
        name: 'Test Channel',
        uuid: 'test-uuid',
        autoname: false,
        icon: 'file:///picons/test.png',
        icon_public_url: 'imagecache/1',
        epgauto: true,
        epglimit: 0,
        epggrab: [],
        dvr_pre_time: 0,
        dvr_pst_time: 0,
        epg_running: -1,
        remote_timeshift: false,
        services: ['test-service'],
        tags: [],
        bouquet: ''
      }],
      total: 1,
    },
  };
  tvheadendApiStub.resolves(expectedResponse);

  const actual = await lineup({ tvheadend_stream_url: 'https://stream.test' });

  t.is(actual[0].GuideNumber, '1');
  t.is(actual[0].GuideName, 'Test Channel');
  t.is(actual[0].URL, 'https://stream.test/stream/channel/test-uuid');
});

test.serial('returns empty when Tvheadend has no channel', async (t) => {
  const expectedResponse = {
    data: {
      entries: [],
      total: 0,
    },
  };
  tvheadendApiStub.resolves(expectedResponse);

  const actual = await lineup({ tvheadend_stream_url: 'https://stream.test' });

  t.deepEqual(actual, []);
});