const request = require('request-promise-native');
const config = require('./config');
const getAPIOptions = require('./api_options');

module.exports = function() {
  let options = getAPIOptions('/api/channel/grid?start=0&limit=999999', config().tvheadend_url);
  return request(options).then(function(body) {
    // TODO: Check if there's a Plex permission problem
    let lineup = [];
    for (let channel of body.entries) {
      if (channel.enabled) {
        lineup.push({
          GuideNumber: String(channel.number),
          GuideName: channel.name,
          URL: `${config().tvheadend_url}/stream/channel/${channel.uuid}`
        })
      }
    }

    return lineup;
  });
}
