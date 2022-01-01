const request = require('request-promise-native');
const apiOptions = require('./apiOptions');

module.exports = function(config) {
  let options = apiOptions.get('/api/channel/grid?start=0&limit=999999', config);
  return request(options).then(function(body) {
    // TODO: Check if there's a Plex permission problem
    let lineup = [];
    for (let channel of body.entries) {
      if (channel.enabled) {
        lineup.push({
          GuideNumber: String(channel.number),
          GuideName: channel.name,
          URL: `${config.public_tvheadend_parsed_stream_uri}/stream/channel/${channel.uuid}`
        })
      }
    }
    
    return lineup;
  });
}
