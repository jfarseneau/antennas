require "kemal"
require "json"
require "yaml"
require "http/client"

class Config
  YAML.mapping(
    bind_address: String,
    tvheadend_url: String,
    antenna_url: String,
    tuner_count: Int32,
    tvheadend_weight: Int32,
    chunk_size: String,
  )
end

def config
  Config.from_yaml(File.read("./config/config.yml"))
end

get "/" do
  "Antennas are operational!" + config.antenna_url
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

# Scan TVHeadend channels and generate a JSON list
get "/lineup.json" do |env|
  env.response.content_type = "application/json"
  response = HTTP::Client.get "http://#{config.tvheadend_url}/api/channel/grid?start=0&limit=999999"
  channels = JSON.parse response.body

  lineup = [] of String
  channels["entries"].each do |channel|
    if channel["enabled"]
      uuid = channel["uuid"]
      url = "#{config.tvheadend_url}/stream/channel/#{uuid}/#{config.tvheadend_weight}"
      lineup << {
        GuideNumber: channel["number"],
        GuideName: channel["name"],
        URL: url
      }.to_json
    end
  end

  lineup.to_json
end

# What's the point of this guy?
get "/lineup.post" do |env|
  env.response.content_type = "application/json"
  
end

# TODO: Flight check to make sure tvheadend is up and running and reachable

Kemal.run(5004)
