const test = require('ava');
const device = require('./device');

test('returns the correct device info', (t) => {
  const actual = device({
    tuner_count: 12,
    device_uuid: '000-000-000',
    antennas_url: 'https://antennas.test',
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
