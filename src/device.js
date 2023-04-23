module.exports = (config) => {
  const device = {
    FriendlyName: 'Virtual Antennas',
    Manufacturer: 'github.com/jfarseneau',
    ManufacturerURL: 'https://github.com/jfarseneau/antennas',
    ModelNumber: 'R2D2',
    FirmwareName: 'antennas',
    TunerCount: config.tuner_count,
    FirmwareVersion: '20170930',
    DeviceID: config.device_uuid,
    DeviceAuth: 'test1234',
    BaseURL: config.antennas_url,
    LineupURL: `${config.antennas_url}/lineup.json`,
  };
  return device;
};
