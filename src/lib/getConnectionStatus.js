const tvheadendApi = require('../tvheadendApi');

module.exports = async function getConnectionStatus(config) {
  try {
    const channels = await tvheadendApi.get('/api/channel/grid?start=0&limit=999999', config);
    let status = 'All systems go';
    if (channels?.response?.status === 403) { throw new Error('Username and password not accepted by Tvheadend'); }
    if (channels?.code === 'ECONNREFUSED') { throw new Error('Unable to connect to Tvheadend'); }
    if (channels?.data?.total === 0) { status = 'Connected but no channels found from Tvheadend'; }
    return {
      status,
      channelCount: channels?.data?.total,
    };
  } catch (err) {
    console.log(`
    Antennas failed to connect to Tvheadend!
    Check that:
      - Tvheadend is running.
      - Antennas is correctly pointing to Tvheadend, on the right port.
      - That your username and login are correct.

    Here's a dump of the error:
    ${err}`);

    let status = 'Unknown error, check the logs for more details';

    if (err && err.response && err.response.status === 401) { status = 'Failed to authenticate with Tvheadend'; }
    if (err && err.code === 'ECONNABORTED') { status = 'Unable to find Tvheadend server, make sure the server is up and the configuration is pointing to the right spot'; }
    if (err && (err.message === 'Auth params error.' || err?.message === 'Username and password not accepted by Tvheadend')) { status = 'Access denied to Tvheadend; check the username, password, and access rights'; }
    if (err && err.message === 'Unable to connect to Tvheadend') { status = 'Unable to connect to Tvheadend; is it running?'; }

    return {
      status,
      channelCount: 0,
    };
  }
};
