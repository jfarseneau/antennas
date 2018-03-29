require "kemal"
# require "kemal-watcher"
require "json"
require "yaml"
require "http/client"

class Config
  YAML.mapping(
    tvheadend_url: String,
    antennas_url: String,
    tvheadend_weight: String,
    tuner_count: String,
  )
end

def config
  Config.from_yaml(File.read("./config/config.yml"))
end

# Seems wrong as free floating functions, but...
def tvheadend_url
  ENV["TVHEADEND_URL"] ||= config.tvheadend_url
end

def antennas_url
  ENV["ANTENNAS_URL"] ||= config.antennas_url
end

def tuner_count
  ENV["TUNER_COUNT"] ||= config.tuner_count
  ENV["TUNER_COUNT"].to_i
end

def tvheadend_weight
  ENV["TVHEADEND_WEIGHT"] ||= config.tvheadend_weight
  ENV["TVHEADEND_WEIGHT"].to_i
end

def device
  {
    FriendlyName: "Antennas",
    Manufacturer: "Silicondust",
    ModelNumber: "HDTC-2US",
    FirmwareName: "hdhomeruntc_atsc",
    TunerCount: tuner_count,
    FirmwareVersion: "20150826",
    DeviceID: "12345670",
    DeviceAuth: "test1234",
    BaseURL: antennas_url,
    LineupURL: "#{antennas_url}/lineup.json"
  }
end

def generate_digest_auth_header(response, username, password)
  #
  authenticate_header = response.headers.get("WWW-Authenticate")[0].split(" ")
  puts response.headers.get("WWW-Authenticate")
  nonce_header = authenticate_header.select do |part|
    part.includes?("nonce")
  end
  nonce_header[0].split('"')[1]
end

def get_connection_status
  begin
    uri = URI.parse(tvheadend_url)
    api_path = "/api/channel/grid?start=0&limit=999999"
    response = HTTP::Client.new(uri) do |client|
      client.tls?
      res = client.get(api_path)
      if res.status_code == 401
        nonce = extract_nonce(res)
        puts nonce
        # client.basic_auth("admin", "")
        client.get(api_path)
      end
    end
    # puts response.pretty_inspect
    return "All systems go" if response && response.status_code == 200
    return "Failed to authenticate with Tvheadend" if response && response.status_code == 401
    "Unknown"
  rescue
    "Unable to find Tvheadend server, make sure the server is up and the configuration is pointing to the right spot"
  end
end

# Router
error 404 do
  File.read "src/public/404.html"
end

get "/" do
  File.read "src/public/index.html"
end

get "/antennas_config.json" do |env|
  env.response.content_type = "application/json"
  {
    tvheadend_url: tvheadend_url,
    antennas_url: antennas_url,
    tuner_count: tuner_count,
    tvheadend_weight: tvheadend_weight,
    status: get_connection_status,
  }.to_json
end

get "/device.xml" do |env|
  env.response.content_type = "application/xml"
  render "src/views/discover.xml.ecr"
end

get "/discover.json" do |env|
  env.response.content_type = "application/json"
  device.to_json
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
  begin
    env.response.content_type = "application/json"
    response = HTTP::Client.get "#{tvheadend_url}/api/channel/grid?start=0&limit=999999"
    channels = JSON.parse response.body

    lineup = [] of {
      "GuideNumber": String,
      "GuideName": String,
      "URL": String
    }
    channels["entries"].each do |channel|
      if channel["enabled"]
        uuid = channel["uuid"]
        url = %[#{tvheadend_url}/stream/channel/#{uuid}?weight=#{tvheadend_weight}]
        lineup << {
          GuideNumber: channel["number"].to_s,
          GuideName: channel["name"].to_s,
          URL: url
        }
      end
    end

    lineup.to_json
  rescue
    body = nil
    body = response.body if response
    raise "Antennas failed to connect to Tvheadend!
    Check that:
      - Tvheadend is running.
      - Antennas is correctly pointing to Tvheadend, on the right port.
      - That your username and login are correct.

    This is what Tvheadend returned, if anything: #{body}"
  end
end

# What's the point of this guy?
get "/lineup.post" do |env|
  env.response.content_type = "application/json"
  ""
end

# TODO: Flight check to make sure tvheadend is up and running and reachable
files = [
  "src/public/**/*"
]

public_folder "src/public"
# Kemal.watch(files)
Kemal.run(5004)
