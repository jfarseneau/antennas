module.exports = (config) => {
  const device = {
    FriendlyName: 'HDHomerun (Antennas)',
    Manufacturer: 'Silicondust',
    ManufacturerURL: 'https://github.com/jfarseneau/antennas',
    ModelNumber: 'HDTC-2US',
    FirmwareName: 'hdhomeruntc_atsc',
    TunerCount: config.tuner_count,
    FirmwareVersion: '20170930',
    DeviceID: config.device_uuid,
    DeviceAuth: 'test1234',
    BaseURL: config.antennas_url,
    LineupURL: `${config.antennas_url}/lineup.json`,
  };
  return device;
};
