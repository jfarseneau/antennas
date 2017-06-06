require "kemal"
require "json"
require "yaml"

class Config
  YAML.mapping(
    bindAddress: String,
    tvheadendURL: String,
    antennaURL: String,
    tunerCount: Int32,
    tvheadendWeight: Int32,
    chunkSize: String,
  )
end

def parseConfig
  config = Config.from_yaml(File.read("./config/config.yml"))
end

get "/" do
  config = parseConfig
  "Antennas are operational!" + config.antennaURL
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

get "/lineup_status.json" do |env|
  env.response.content_type = "application/json"
  {
    ScanInProgress: 0,
    ScanPossible: 1,
    Source: "Cable",
    SourceList: ["Cable"],
  }.to_json
end

get "/lineup.json" do |env|
  env.response.content_type = "application/json"
  # TODO: Scan TVHeadend channels and generate a JSON list
end

get "/lineup.post" do |env|
  env.response.content_type = "application/json"
  # What's the point of this guy?
end

Kemal.run(5004)
