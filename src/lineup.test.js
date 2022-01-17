const test = require('ava');
const sinon = require('sinon');
const axios = require('axios');

const lineup = require('./lineup');
const tvheadendApi = require('./tvheadendApi');

test('calls the API with the right options', async t => {
  const config = { 
    url: 'https://test.test',
    method: 'GET',
    responseType: 'json',
    auth: {
      username: 'user',
      password: 'pass'
    }
  }
  sinon.stub(tvheadendApi, "get").returns(config);
  const expectedResponse = {
    entries: [{
      enabled: true,
      number: 1,
      name: 'Test Channel',
      uuid: 'test-uuid'
    }]
  }
  sinon.stub(axios, "get").resolves(expectedResponse);  
  const actual = await lineup({tvheadend_stream_url: 'https://stream.test'});

  t.is(actual[0].GuideNumber, '1');
  t.is(actual[0].GuideName, 'Test Channel');
  t.is(actual[0].URL, 'https://stream.test/stream/channel/test-uuid');
});