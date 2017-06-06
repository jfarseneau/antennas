require "kemal"
require "json"

get "/" do
  "Antennas are operational!"
end

get "/discover.json" do |env|
  env.response.content_type = "application/json"
  {
    FriendlyName: "Antennas",
    ModelNumber: "HDTC-2US",
    FirmwareName: "hdhomeruntc_atsc",
    TunerCount: 6,
    FirmwareVersion: "20150826",
    DeviceID: "12345678",
    DeviceAuth: "test1234",
    BaseURL: "test",
    LineupURL: "test"
  }.to_json
end

Kemal.run
