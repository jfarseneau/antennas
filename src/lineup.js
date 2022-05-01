const tvheadendApi = require('./tvheadendApi');

module.exports = async (config) => {
  const response = await tvheadendApi.get('/api/channel/grid?start=0&limit=999999', config);
  const lineup = [];
  
  if (response) {
    const { data } = response;
    // TODO: Check if there's a Plex permission problem

    if (data?.entries) {
      for (const channel of data.entries) {
        if (channel.enabled) {
          lineup.push({
            GuideNumber: String(channel.number),
            GuideName: channel.name,
            URL: `${config.tvheadend_stream_url}/stream/channel/${channel.uuid}`,
          });
        }
      }
    }
  }
  

  return lineup;
};
