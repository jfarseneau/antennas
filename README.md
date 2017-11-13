# Antennas

A Crystal port of [tvhProxy](https://github.com/jkaberg/tvhProxy) which is a program that translates the Tvheadend API to emulate a HDHomeRun API. This is particularly useful to connect [Plex's DVR feature](https://www.plex.tv/features/live-tv-dvr/) to Tvheadend.

## Getting it running

### Docker

Simplest way to get it running is to run it:
`docker run -p 5004:5004 -e ANTENNAS_URL=http://192.168.0.2:5004 -e TVHEADEND_URL=http://user:pass@192.168.0.1:9981 thejf/antennas`

Alternatively, you can set it with all the available environment variables:
```
  docker create --name=antennas
    -e ANTENNAS_URL=http://192.168.0.2:5004
    -e TVHEADEND_URL=http://user:pass@192.168.0.1:9981
    -e TVHEADEND_WEIGHT=300
    -e TUNER_COUNT=6
    -p 5004:5004
    thejf/antennas
```

And then `docker start antennas`

Or, you can try by mounting a volume, set by yourself in path/to/config, that will need a config.yml to work. Example of a config.yml is [available here](https://github.com/TheJF/antennas/blob/master/config/config.yml), or below:
```
tvheadend_url: http://replace:me@x.x.x.x:9981
antennas_url: http://x.x.x.x:5004
tvheadend_weight: 300
tuner_count: 6
```

* `docker create --name=antennas -v <path/to/config>:/antennas/config -p 5004:5004 thejf/antennas`
* Set up `config.yml` (see configuration instructions [here](https://github.com/TheJF/antennas#configuration)) where you pointed the config volume (what you replaced `<path/to/config>` with
* Finally, `docker start antennas`

### Linux

* Create a directory to store antennas, i.e. `mkdir antennas`
* Download a [Linux release of antennas](https://github.com/TheJF/antennas/releases) inside Antennas directory
* Untar Antennas
* [Configure your server](https://github.com/TheJF/antennas#configuration)
* Run `./antennas`

### Mac OS X

* Download a [macOS release of antennas](https://github.com/TheJF/antennas/releases)
* Extract from the zip
* Open your terminal and navigate to where Antennas was extracted
* [Configure your server](https://github.com/TheJF/antennas#configuration)
* Run `./antennas`

### Windows

Because Crystal does not yet compile to Windows, and I haven't rewritten this once more in a language that does, to run an executable of this you need to setup Ubuntu on Windows and run it that way.

* (Setup Bash on Windows Subsystem for Linux)[https://msdn.microsoft.com/en-us/commandline/wsl/install_guide]
* Run `bash` in command prompt
* Create a directory to store antennas, i.e. `mkdir antennas`
* Download a [Linux release of antennas](https://github.com/TheJF/antennas/releases) inside Antennas directory
* Untar Antennas
* [Configure your server](https://github.com/TheJF/antennas#configuration)
* Run `./antennas`

## Configuration

Antennas can be configured either via the config.yml or environment variables. Environment variables take precedence over the config.yml.

#### config.yml

Antennas will look for three values inside a `config/config.yml` file. They are:

* `tvheadend_url`: This is the path to your Tvheadend setup, with username, password, and port. Plex doesn't like `localhost` so it's best to find your own local IP and put this in if Tvheadend and Plex are running on the same network. For example: `http://user:pass@192.168.0.1:9981`
* `tvheadend_weight`: This is a subscripton weight. I have no idea what it's for to be honest.
* `tuner_count`: This is for the number of tuners in Tvheadend.

#### Environment variables

If you want to set environment variables instead of modifying the config.yml, you can do so. The environment variable names are the same than the config.yml, except capitalized. So, `TVHEADEND_URL`, `TVHEADEND_WEIGHT`, and `TUNER_COUNT`.

### Docker Configuration

Docker instructions coming soon, along with Dockerfile, and the whole shebang.

## Development

### Building Antennas locally
* [Install Crystal](https://crystal-lang.org/docs/installation/) if you do not yet have it
* Run `shards install`
* Run `crystal build ./src/antennas.cr`
* Run `./antennas`

In case you get these linking errors 

```
/usr/bin/ld: cannot find -lz
/usr/bin/ld: cannot find -lssl
/usr/bin/ld: cannot find -lcrypto
```

please assure that you have `libssl-dev` installed.


## Contributing

1. Fork it ( https://github.com/thejf/antennas/fork )
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create a new Pull Request

## Contributors

- [TheJF](https://github.com/[your-github-name]) Jean-Francois Arseneau - creator, maintainer
