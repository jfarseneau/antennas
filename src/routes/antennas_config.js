const config = require('../lib/config');
const getAPIOptions = require('../lib/api_options');

const request = require('request-promise-native');

function getConnectionStatus(tvheadendUrl) {
  let options = getAPIOptions('/api/channel/grid?start=0&limit=999999', tvheadendUrl);
  let result = request(options).then(function(body) {
    return "All systems go";
  }).catch(function(err) {
    console.log(`
    Antennas failed to connect to Tvheadend!
    Check that:
      - Tvheadend is running.
      - Antennas is correctly pointing to Tvheadend, on the right port.
      - That your username and login are correct.

    Here's a dump of the error:
    ${err}`);
    if (err.statusCode === 401) { return "Failed to authenticate with Tvheadend"; }
    else if (err.cause.code === "ETIMEDOUT") { return "Unable to find Tvheadend server, make sure the server is up and the configuration is pointing to the right spot"; }
    else { return "Unknown error, check the logs for more details"; }
  });
  return result;
}

module.exports = async function() {
  let configuration = config();
  configuration.status = await getConnectionStatus(tvheadendUrl);
  return configuration;
}
