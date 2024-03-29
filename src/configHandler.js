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

function structureConfig(tvheadendUrl, tvheadendStreamUrl, antennasUrl, tunerCount, deviceUuid) {
  const parsedTvheadendURI = parseTvheadendURI(tvheadendUrl);
  const parsedTvheadendStreamURI = parseTvheadendURI(tvheadendStreamUrl);
  return {
    tvheadend_parsed_uri: parsedTvheadendURI.uri,
    tvheadend_username: parsedTvheadendURI.username,
    tvheadend_password: parsedTvheadendURI.password,
    tvheadend_url: tvheadendUrl,
    tvheadend_stream_url: tvheadendStreamUrl,
    tvheadend_parsed_stream_uri: parsedTvheadendStreamURI.uri,
    tvheadend_stream_username: parsedTvheadendStreamURI.username,
    tvheadend_stream_password: parsedTvheadendStreamURI.password,
    antennas_url: antennasUrl,
    tuner_count: tunerCount,
    device_uuid: deviceUuid,
  };
}

// eslint-disable-next-line consistent-return
function loadConfig(configFile = 'config/config.yml') {
  // Check if you even need to load the config file
  if (process.env.TVHEADEND_URL && process.env.ANTENNAS_URL && process.env.TUNER_COUNT && process.env.DEVICE_UUID) {
    const tvheadendStreamUrl = process.env.TVHEADEND_STREAM_URL || process.env.TVHEADEND_URL; // Optional
    return structureConfig(process.env.TVHEADEND_URL, tvheadendStreamUrl, process.env.ANTENNAS_URL, parseInt(process.env.TUNER_COUNT, 10), process.env.DEVICE_UUID);
  }

  // If you do, load it
  if (fs.existsSync(configFile)) {
    const config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
    return structureConfig(
      process.env.TVHEADEND_URL || config.tvheadend_url,
      process.env.TVHEADEND_STREAM_URL || config.stream_url || process.env.TVHEADEND_URL || config.tvheadend_url,
      process.env.ANTENNAS_URL || config.antennas_url,
      parseInt(process.env.TUNER_COUNT, 10) || config.tuner_count,
      process.env.DEVICE_UUID || config.device_uuid,
    );
  }
  // eslint-disable-next-line no-console
  console.log(`❌ Config file ${configFile} could not be found; did you specify a config file and is it the right path?`);
  process.exit(1);
}

module.exports = { loadConfig, structureConfig, parseTvheadendURI };
