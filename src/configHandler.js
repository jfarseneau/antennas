const yaml = require('js-yaml');
const fs = require('fs');

function structureConfig(tvheadendUrl, antennasUrl, tunerCount, deviceUuid) {
  let splitURI = tvheadendUrl.split('@');
  let parsedTvheadendURI;
  if (splitURI.length > 1) {
    let password = splitURI[0].split(':')[2];
    let username = splitURI[0].split(":")[1].substr(2);
    let parsedURI = `${splitURI[0].split(":")[0]}://${splitURI[1]}`
    parsedTvheadendURI = {
      username: username,
      password: password,
      uri: parsedURI,
    }
  } else {
    parsedTvheadendURI = {
      username: null,
      password: null,
      uri: uri,
    }
  }

  return {
    tvheadend_parsed_uri: parsedTvheadendURI.uri,
    tvheadend_username: parsedTvheadendURI.username,
    tvheadend_password: parsedTvheadendURI.password,
    tvheadend_url: tvheadendUrl,
    antennas_url: antennasUrl,
    tuner_count: tunerCount,
    device_uuid: deviceUuid
  }
}

function loadConfig(configFile = 'config/config.yml') {
  // Check if you even need to load the config file
  if (process.env.TVHEADEND_URL && process.env.ANTENNAS_URL && process.env.TUNER_COUNT && process.env.DEVICE_UUID) {
    return structureConfig(process.env.TVHEADEND_URL, process.env.ANTENNAS_URL, process.env.TUNER_COUNT, process.env.DEVICE_UUID);
  }

  // If you do, load it
  if (fs.existsSync(configFile)) {
    let config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));
    return structureConfig(
      process.env.TVHEADEND_URL || config.tvheadend_url,
      process.env.ANTENNAS_URL || config.antennas_url,
      process.env.TUNER_COUNT || config.tuner_count,
      process.env.DEVICE_UUID || config.device_uuid,
    )
  } else {
    console.log(`❌ Config file ${configFile} could not be found; did you specify a config file and is it the right path?`);
    process.exit(1);
  }
}

module.exports = { loadConfig }