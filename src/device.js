const config = require('./config');

module.exports = function() {
  return {
    FriendlyName: "Antennas",
    Manufacturer: "Silicondust",
    ModelNumber: "HDTC-2US",
    FirmwareName: "hdhomeruntc_atsc",
    TunerCount: config().tuner_count,
    FirmwareVersion: "20170930",
    DeviceID: "12345670",
    DeviceAuth: "test1234",
    BaseURL: config().antennas_url,
    LineupURL: `${config().antennas_url}/lineup.json`
  };
}
