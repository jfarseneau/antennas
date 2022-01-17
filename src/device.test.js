const test = require('ava');
const device = require('./device');

test('returns the correct device info', (t) => {
  const actual = device({
    tuner_count: 12,
    device_uuid: '000-000-000',
    antennas_url: 'https://antennas.test',
  });

  expected = {
    FriendlyName: 'HDHomerun (Antennas)',
    Manufacturer: 'Silicondust',
    ManufacturerURL: 'https://github.com/jfarseneau/antennas',
    ModelNumber: 'HDTC-2US',
    FirmwareName: 'hdhomeruntc_atsc',
    TunerCount: 12,
    FirmwareVersion: '20170930',
    DeviceID: '000-000-000',
    DeviceAuth: 'test1234',
    BaseURL: 'https://antennas.test',
    LineupURL: 'https://antennas.test/lineup.json',
  };

  t.deepEqual(actual, expected);
});
