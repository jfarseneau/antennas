const Router = require('koa-router');
const config = require('./config');
const device = require('./device');
const lineup = require('./lineup');

const request = require('request-promise-native');
const getAPIOptions = require('./api_options');

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

module.exports = function() {
  const router = new Router();

  router.get('/antennas_config.json', async (ctx, next) => {
    ctx.type = "application/json"
    let configuration = config();
    configuration.status = await getConnectionStatus(tvheadendUrl),
    ctx.body = configuration;
  });

  router.get('/device.xml', (ctx, next) => {
    ctx.type = "application/xml"
    ctx.body = `
      <root xmlns="urn:schemas-upnp-org:device-1-0">
        <specVersion>
            <major>1</major>
            <minor>0</minor>
        </specVersion>
        <URLBase>${device().BaseURL}</URLBase>
        <device>
            <deviceType>urn:schemas-upnp-org:device:MediaServer:1</deviceType>
            <friendlyName>${device().FriendlyName}</friendlyName>
            <manufacturer>${device().Manufacturer}</manufacturer>
            <modelName>${device().ModelNumber}</modelName>
            <modelNumber>${device().ModelNumber}</modelNumber>
            <serialNumber></serialNumber>
            <UDN>uuid:${device().DeviceID}</UDN>
        </device>
      </root>
    `
  });

  router.get('/discover.json', (ctx, next) => {
    ctx.type = "application/json"
    ctx.body = device();
  });

  router.get('/lineup_status.json', (ctx, next) => {
    ctx.type = "application/json"
    ctx.body = {
      ScanInProgress: 0,
      ScanPossible: 1,
      Source: "Cable",
      SourceList: ["Cable"],
    }
  });

  router.get('/lineup.json', async (ctx, next) => {
    ctx.type = "application/json"
    ctx.body = await lineup();
  });

  // Still don't know if this is useful or not
  router.post('/lineup.post', (ctx, next) => {
    ctx.type = "application/json"
  });

  return router;
};
