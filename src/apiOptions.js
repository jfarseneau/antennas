function get(apiPath, config) {
  const options = {
    url: `${config.tvheadend_parsed_uri}${apiPath}`,
    method: 'GET',
    json: true,
    timeout: 1500,
  };

  if (config.tvheadend_username) {
    options.auth = {
      'user': config.tvheadend_username,
      'pass': config.tvheadend_password,
      'sendImmediately': false
    }
  }

  return options;
}

module.exports = { get }
