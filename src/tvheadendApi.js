const axios = require('axios');

async function get(apiPath, config) {
  const options = {
    responseType: 'json',
    timeout: 1500,
  };

  if (config.tvheadend_username) {
    options.auth = {
      username: config.tvheadend_username,
      password: config.tvheadend_password,
    };
  }

  return axios.get(`${config.tvheadend_parsed_uri}${apiPath}`, options);
}

module.exports = { get };
