module.exports = (config) => {
  const device = {
    FriendlyName: config.deviceName,
    Manufacturer: config.deviceManufacturer,
    ManufacturerURL: config.deviceManufacturerUrl,
    ModelNumber: config.deviceModelNumber,
    FirmwareName: config.deviceFirmwareName,
    TunerCount: config.tunerCount,
    FirmwareVersion: config.deviceFirmwareVersion,
    DeviceID: config.deviceUuid,
    DeviceAuth: config.deviceAuth,
    BaseURL: config.antennasUrl,
    LineupURL: `${config.antennasUrl}/lineup.json`,
  };
  return device;
};
