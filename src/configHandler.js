const yaml = require('js-yaml');
const fs = require('fs');

function parseTvheadendURI(uri) {
  const splitURI = uri.split('@');
  let parsedUri;
  if (splitURI.length > 1) {
    const password = splitURI[0].split(':')[2];
    const username = splitURI[0].split(':')[1].substr(2);
    const parsedURI = `${splitURI[0].split(':')[0]}://${splitURI[1]}`;
    parsedUri = {
      username,
      password,
      uri: parsedURI,
    };
  } else {
    parsedUri = {
      username: null,
      password: null,
      uri,
    };
  }

  return parsedUri;
}

// eslint-disable-next-line consistent-return
function loadConfig(configFile = 'config/config.yml') {
  let yamlConfig = {};
  if (fs.existsSync(configFile)) {
    yamlConfig = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
  }

  const parsedTvheadendURI = parseTvheadendURI(process.env.TVHEADEND_URL || yamlConfig.tvheadend_url);
  const parsedTvheadendStreamURI = parseTvheadendURI(process.env.TVHEADEND_STREAM_URL || yamlConfig.stream_url || process.env.TVHEADEND_URL || yamlConfig.tvheadend_url);

  return {
    tvheadendUrl: parsedTvheadendURI.uri,
    tvheadendUsername: parsedTvheadendURI.username,
    tvheadendPassword: parsedTvheadendURI.password,
    tvheadendStreamUrl: parsedTvheadendStreamURI.uri,
    tvheadendStreamUsername: parsedTvheadendStreamURI.username,
    tvheadendStreamPassword: parsedTvheadendStreamURI.password,
    antennasUrl: process.env.ANTENNAS_URL || yamlConfig.antennas_url,
    tunerCount: parseInt(process.env.TUNER_COUNT, 10) || yamlConfig.tuner_count || 10,
    deviceUuid: process.env.DEVICE_UUID || yamlConfig.device_uuid || '2f70c0d7-90a3-4429-8275-cbeeee9cd605',
    deviceName: process.env.DEVICE_NAME || yamlConfig.device_name || 'Virtual Antennas',
    deviceManufacturer: process.env.DEVICE_MANUFACTURER || yamlConfig.device_manufacturer || 'github.com/jfarseneau',
    deviceManufacturerUrl: process.env.DEVICE_MANUFACTURER_URL || yamlConfig.device_manufacturer_url || 'https://github.com/jfarseneau/antennas',
    deviceModelNumber: process.env.DEVICE_MODEL_NUMBER || yamlConfig.device_model_number || 'R2D2',
    deviceFirmwareName: process.env.DEVICE_FIRMWARE_NAME || yamlConfig.device_firmware_name || 'antennas',
    deviceFirmwareVersion: process.env.DEVICE_FIRMWARE_VERSION || yamlConfig.device_firmware_version || '20170930',
    deviceAuth: process.env.DEVICE_AUTH || yamlConfig.device_auth || 'test1234',
  };
}

module.exports = { loadConfig, parseTvheadendURI };
