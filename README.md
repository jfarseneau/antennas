# Antennas

A Crystal port of [tvhProxy](https://github.com/jkaberg/tvhProxy) which is a program that translates the Tvheadend API to emulate a HDHomeRun API. This is particularly useful to connect [Plex's DVR feature](https://www.plex.tv/features/live-tv-dvr/) to Tvheadend.

## Installation

### Linux

Coming soon.

### Mac OS X

Coming soon.

### Windows

Coming soon.

## Usage

After configuring Antennas for your setup (see below), run `./antennas` and you're good to go, as far as setting up the layer between Tvheadend and Plex.

Detailed instructions on how to get through setting it up on Plex coming soon.

### Configuration

Antennas can be configured either via the config.yml or environment variables. Environment variables take precedence over the config.yml.

#### config.yml

Antennas will look for three values inside a `config/config.yml` file. They are:

* `tvheadend_url`: This is the path to your Tvheadend setup, with username, password, and port. Plex doesn't like `localhost` so it's best to find your own local IP and put this in if Tvheadend and Plex are running on the same network. For example: `http://user:pass@192.168.0.1:9981`
* `tvheadend_weight`: This is a subscripton weight. I have no idea what it's for to be honest.
* `tuner_count`: This is for the number of tuners in Tvheadend.

#### Environment variables

If you want to set environment variables instead of modifying the config.yml, you can do so. The environment variable names are the same than the config.yml, except capitalized. So, `TVHEADEND_URL`, `TVHEADEND_WEIGHT`, and `TUNER_COUNT`.

### Docker

Docker instructions coming soon, along with Dockerfile, and the whole shebang.

## Development

### Building Antennas locally
* [Install Crystal](https://crystal-lang.org/docs/installation/) if you do not yet have it
* Run `crystal build ./antennas/antennas.cr`
* Run `./antennas`

## Contributing

1. Fork it ( https://github.com/thejf/antennas/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [TheJF](https://github.com/[your-github-name]) Jean-Francois Arseneau - creator, maintainer
