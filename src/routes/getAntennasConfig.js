const getConnectionStatus = require('../lib/getConnectionStatus');

module.exports = async function antennasConfig(config) {
  const { status, channelCount } = await getConnectionStatus(config);
  config.status = status;
  config.channel_count = channelCount;
  return config;
}
