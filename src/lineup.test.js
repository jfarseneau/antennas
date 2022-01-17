const test = require('ava');
const sinon = require('sinon');
const axios = require('axios');

const lineup = require('./lineup');
const tvheadendApi = require('./tvheadendApi');

test('calls the API with the right options', async (t) => {
  const expectedResponse = {
    entries: [{
      enabled: true,
      number: 1,
      name: 'Test Channel',
      uuid: 'test-uuid',
    }],
  };
  sinon.stub(tvheadendApi, 'get').resolves(expectedResponse);

  sinon.stub(axios, 'get').resolves(expectedResponse);
  const actual = await lineup({ tvheadend_stream_url: 'https://stream.test' });

  t.is(actual[0].GuideNumber, '1');
  t.is(actual[0].GuideName, 'Test Channel');
  t.is(actual[0].URL, 'https://stream.test/stream/channel/test-uuid');
});
