const test = require('ava');
const device = require('./device');

test('returns the correct device info', (t) => {
  const actual = device({
    tunerCount: 12,
    deviceUuid: '000-000-000',
    antennasUrl: 'https://antennas.test',
    deviceName: 'Virtual Antennas',
    deviceManufacturer: 'github.com/jfarseneau',
    deviceManufacturerUrl: 'https://github.com/jfarseneau/antennas',
    deviceModelNumber: 'R2D2',
    deviceFirmwareName: 'antennas',
    deviceFirmwareVersion: '20170930',
    deviceAuth: 'test1234',
  });

  const expected = {
    FriendlyName: 'Virtual Antennas',
    Manufacturer: 'github.com/jfarseneau',
    ManufacturerURL: 'https://github.com/jfarseneau/antennas',
    ModelNumber: 'R2D2',
    FirmwareName: 'antennas',
    TunerCount: 12,
    FirmwareVersion: '20170930',
    DeviceID: '000-000-000',
    DeviceAuth: 'test1234',
    BaseURL: 'https://antennas.test',
    LineupURL: 'https://antennas.test/lineup.json',
  };

  t.deepEqual(actual, expected);
});
