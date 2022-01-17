const axios = require('axios');
const tvheadendApi = require('./tvheadendApi');

module.exports = async function(config) {
  let body = await tvheadendApi.get('/api/channel/grid?start=0&limit=999999', config);
  
  // TODO: Check if there's a Plex permission problem
  let lineup = [];
  for (let channel of body.entries) {
    if (channel.enabled) {
      lineup.push({
        GuideNumber: String(channel.number),
        GuideName: channel.name,
        URL: `${config.tvheadend_stream_url}/stream/channel/${channel.uuid}`
      })
    }
  }

  return lineup;
}
