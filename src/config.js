const yaml = require('js-yaml');
const fs = require('fs');

function parseTvheadendURI(uri) {
    let splitURI = uri.split('@');
    if (splitURI.length > 1) {
        let password = splitURI[0].split(':')[2];
        let username = splitURI[0].split(":")[1].substr(2);
        let parsedURI = `${splitURI[0].split(":")[0]}://${splitURI[1]}`
        return {
            username: username,
            password: password,
            uri: parsedURI,
        }
    } else {
        return {
            username: null,
            password: null,
            uri: uri,
        }
    }
}

module.exports = function () {
    let config = yaml.safeLoad(fs.readFileSync('config/config.yml', 'utf8'));
    tvheadendUrl = process.env.TVHEADEND_URL || config.tvheadend_url;
    publicTvheadendStreamUrl = process.env.PUBLIC_TVHEADEND_STREAM_URL || process.env.TVHEADEND_URL || config.tvheadend_url;
    antennasUrl = process.env.ANTENNAS_URL || config.antennas_url;
    tunerCount = parseInt(process.env.TUNER_COUNT) || config.tuner_count;
    DeviceUuid = process.env.DEVICE_UUID || config.device_uuid;
    let parsedTvheadendURI = parseTvheadendURI(tvheadendUrl);
    let parsedPublicTvheadendStreamURI = parseTvheadendURI(publicTvheadendStreamUrl);
    return {
        tvheadend_parsed_uri: parsedTvheadendURI.uri,
        public_tvheadend_parsed_stream_uri: parsedPublicTvheadendStreamURI.uri,
        tvheadend_username: parsedTvheadendURI.username,
        tvheadend_password: parsedTvheadendURI.password,
        tvheadend_url: tvheadendUrl,
        public_tvheadend_stream_url: publicTvheadendStreamUrl,
        antennas_url: antennasUrl,
        tuner_count: tunerCount,
        device_uuid: DeviceUuid
    }
}
