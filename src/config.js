const yaml = require('js-yaml');
const fs = require('fs');

module.exports = function() {
  let config = yaml.safeLoad(fs.readFileSync('config/config.yml', 'utf8'));
  tvheadendUrl = process.env.TVHEADEND_URL || config.tvheadend_url;
  antennasUrl = process.env.ANTENNAS_URL || config.antennas_url;
  tunerCount = process.env.TUNER_COUNT || config.tuner_count;
  tvheadendWeight = process.env.TVHEADEND_WEIGHT || config.tvheadend_weight;
  return {
    tvheadend_url: tvheadendUrl,
    antennas_url: antennasUrl,
    tuner_count: tunerCount,
    tvheadend_weight: tvheadendWeight,
  }
}
